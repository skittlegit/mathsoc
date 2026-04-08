"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

interface EventItem {
  id: string;
  year: number;
  date: string;
  title: string;
  full: string;
  location: string;
  desc: string;
  tag: string;
  photo?: string;
  content?: string;
  gallery?: string[];
}

const TAGS = ["Competition", "Academic", "Orientation"];

const emptyEvent: EventItem = {
  id: "",
  year: new Date().getFullYear(),
  date: "",
  title: "",
  full: "",
  location: "",
  desc: "",
  tag: "Competition",
  photo: "",
  content: "",
  gallery: [],
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwdInput, setPwdInput] = useState("");
  const [pwdError, setPwdError] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState<EventItem>({ ...emptyEvent });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `event_images/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);
    return new Promise((resolve, reject) => {
      task.on("state_changed", null, reject, () => {
        getDownloadURL(task.snapshot.ref).then(resolve).catch(reject);
      });
    });
  };

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchEvents = useCallback(async () => {
    try {
      const q = query(collection(db, "events"), orderBy("date", "desc"));
      const snap = await getDocs(q);
      const list: EventItem[] = [];
      snap.forEach((d) => {
        const data = d.data();
        const rawDate = data.date;
        let dateStr = "";
        let year = new Date().getFullYear();
        if (rawDate && typeof rawDate === "object" && "toDate" in rawDate) {
          const dt = (rawDate as { toDate: () => Date }).toDate();
          dateStr = dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase();
          year = dt.getFullYear();
        } else if (typeof rawDate === "string") {
          dateStr = rawDate;
          const parsed = new Date(rawDate);
          if (!isNaN(parsed.getTime())) year = parsed.getFullYear();
        }
        list.push({
          id: d.id,
          year,
          date: dateStr,
          title: (data.title as string) || "",
          full: (data.title as string) || "",
          location: (data.location as string) || "",
          desc: (data.summary as string) || (data.content as string) || "",
          tag: (data.category as string) || "Event",
          photo: (data.mainImageUrl as string) || undefined,
          content: (data.content as string) || undefined,
          gallery: (data.additionalImageUrls as string[]) || undefined,
        });
      });
      setEvents(list);
    } catch {
      showToast("Failed to load events", "err");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const slug =
        form.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-") +
        "-" +
        form.year;

      const firestoreData = {
        title: form.full || form.title,
        summary: form.desc,
        content: form.content || form.desc,
        slug,
        date: form.date,
        location: form.location,
        category: form.tag,
        mainImageUrl: form.photo || "",
        additionalImageUrls: Array.isArray(form.gallery) ? form.gallery : [],
      };

      if (editing && form.id) {
        await updateDoc(doc(db, "events", form.id), firestoreData);
      } else {
        await addDoc(collection(db, "events"), {
          ...firestoreData,
          createdAt: serverTimestamp(),
        });
      }

      showToast(editing ? "Event updated" : "Event created");
      setForm({ ...emptyEvent });
      setEditing(false);
      await fetchEvents();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Save failed", "err");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (ev: EventItem) => {
    setForm({ ...ev, gallery: ev.gallery ?? [] });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setForm({ ...emptyEvent });
    setEditing(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "events", id));
      showToast("Event deleted");
      setDeleteConfirm(null);
      if (form.id === id) cancelEdit();
      await fetchEvents();
    } catch {
      showToast("Delete failed", "err");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    fontSize: "0.85rem",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "4px",
    color: "rgba(255,255,255,0.85)",
    outline: "none",
    fontFamily: "var(--font-space-grotesk)",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.6rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.3)",
    marginBottom: "6px",
  };

  /* ─── Password gate ─── */
  if (!authed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-7">
        <span
          style={{
            fontSize: "0.5rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.18)",
            marginBottom: 32,
            display: "block",
          }}
        >
          Admin Panel
        </span>
        <div style={{ width: "100%", maxWidth: 340 }}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={pwdInput}
            autoFocus
            onChange={(e) => { setPwdInput(e.target.value); setPwdError(false); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (pwdInput === "geometrystinks") setAuthed(true);
                else setPwdError(true);
              }
            }}
            style={{
              ...inputStyle,
              borderColor: pwdError ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)",
            }}
            placeholder="Enter password"
          />
          {pwdError && (
            <p style={{ fontSize: "0.65rem", color: "rgb(252,165,165)", marginTop: 8 }}>
              Incorrect password.
            </p>
          )}
          <button
            onClick={() => {
              if (pwdInput === "geometrystinks") setAuthed(true);
              else setPwdError(true);
            }}
            style={{
              marginTop: 16,
              width: "100%",
              padding: "11px",
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "4px",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              fontFamily: "var(--font-space-grotesk)",
            }}
          >
            Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 md:pt-44 pb-24">
      <div className="px-7 md:px-14 max-w-4xl mx-auto">
        {/* Header */}
        <span
          style={{
            fontSize: "0.56rem",
            letterSpacing: "0.4em",
            color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase",
          }}
        >
          Admin Panel
        </span>
        <h1
          className="font-bold uppercase mt-4 mb-12"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 5rem)",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.9)",
            lineHeight: 0.95,
          }}
        >
          Events
        </h1>

        {/* Toast */}
        {toast && (
          <div
            style={{
              position: "fixed",
              top: 24,
              right: 24,
              zIndex: 100,
              padding: "12px 20px",
              borderRadius: "4px",
              fontSize: "0.8rem",
              background: toast.type === "ok" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
              border: `1px solid ${toast.type === "ok" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
              color: toast.type === "ok" ? "rgb(134,239,172)" : "rgb(252,165,165)",
            }}
          >
            {toast.msg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: 48 }}>
          <div
            style={{
              padding: "28px",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "6px",
              background: "rgba(255,255,255,0.015)",
            }}
          >
            <h2
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
                marginBottom: 24,
                letterSpacing: "0.02em",
              }}
            >
              {editing ? "Edit Event" : "New Event"}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Title (short)</label>
                <input
                  style={inputStyle}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. MCSE"
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Full Title</label>
                <input
                  style={inputStyle}
                  value={form.full}
                  onChange={(e) => setForm({ ...form, full: e.target.value })}
                  placeholder="e.g. Math Club Stock Exchange"
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Date</label>
                <input
                  style={inputStyle}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  placeholder="e.g. APR 5, 2025"
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Year</label>
                <input
                  style={inputStyle}
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                  min={2020}
                  max={2099}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Tag</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 4 }}>
                {TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, tag: t })}
                    style={{
                      padding: "8px 18px",
                      fontSize: "0.62rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      borderRadius: "3px",
                      border: "1px solid",
                      borderColor: form.tag === t ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.08)",
                      background: form.tag === t ? "rgba(255,255,255,0.1)" : "transparent",
                      color: form.tag === t ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
                      cursor: "pointer",
                      fontFamily: "var(--font-space-grotesk)",
                      transition: "all 0.15s",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Location</label>
              <input
                style={inputStyle}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. ECR-5"
                required
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Description</label>
              <textarea
                style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                placeholder="Event description..."
                required
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Cover Photo (optional)</label>
              {/* File upload */}
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                <button
                  type="button"
                  disabled={uploadingCover}
                  onClick={() => coverInputRef.current?.click()}
                  style={{
                    padding: "8px 16px",
                    fontSize: "0.65rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "4px",
                    color: "rgba(255,255,255,0.6)",
                    cursor: uploadingCover ? "not-allowed" : "pointer",
                    opacity: uploadingCover ? 0.5 : 1,
                    fontFamily: "var(--font-space-grotesk)",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {uploadingCover ? "Uploading..." : "Upload Image"}
                </button>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingCover(true);
                    try {
                      const url = await uploadFile(file);
                      setForm((f) => ({ ...f, photo: url }));
                    } catch {
                      showToast("Cover upload failed", "err");
                    } finally {
                      setUploadingCover(false);
                      e.target.value = "";
                    }
                  }}
                />
                {form.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.photo}
                    alt="Cover preview"
                    style={{ height: 48, width: 72, objectFit: "cover", borderRadius: 3, border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                )}
              </div>
              {/* Manual URL fallback */}
              <input
                style={{ ...inputStyle, fontSize: "0.75rem" }}
                value={form.photo ?? ""}
                onChange={(e) => setForm({ ...form, photo: e.target.value })}
                placeholder="Or paste a URL directly..."
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Full Content (optional — appears on the event detail page)</label>
              <textarea
                style={{ ...inputStyle, minHeight: 160, resize: "vertical" }}
                value={form.content ?? ""}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write the full event description here. Use blank lines between paragraphs."
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Gallery Images (optional)</label>
              {/* Upload button */}
              <div style={{ marginBottom: 10 }}>
                <button
                  type="button"
                  disabled={uploadingGallery}
                  onClick={() => galleryInputRef.current?.click()}
                  style={{
                    padding: "8px 16px",
                    fontSize: "0.65rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "4px",
                    color: "rgba(255,255,255,0.6)",
                    cursor: uploadingGallery ? "not-allowed" : "pointer",
                    opacity: uploadingGallery ? 0.5 : 1,
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  {uploadingGallery ? "Uploading..." : "Add Images"}
                </button>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const files = Array.from(e.target.files ?? []);
                    if (!files.length) return;
                    setUploadingGallery(true);
                    try {
                      const urls = await Promise.all(files.map(uploadFile));
                      setForm((f) => ({ ...f, gallery: [...(f.gallery ?? []), ...urls] }));
                    } catch {
                      showToast("One or more uploads failed", "err");
                    } finally {
                      setUploadingGallery(false);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
              {/* Thumbnail list */}
              {(form.gallery ?? []).length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                  {(form.gallery ?? []).map((url, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Gallery ${i + 1}`}
                        style={{ height: 64, width: 96, objectFit: "cover", borderRadius: 3, border: "1px solid rgba(255,255,255,0.08)", display: "block" }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, gallery: (f.gallery ?? []).filter((_, j) => j !== i) }))
                        }
                        style={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: "rgba(0,0,0,0.7)",
                          border: "none",
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "0.7rem",
                          lineHeight: 1,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.18)", marginTop: 2 }}>
                {(form.gallery ?? []).length} image{(form.gallery ?? []).length !== 1 ? "s" : ""} added
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: "10px 28px",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "4px",
                  color: "rgba(255,255,255,0.8)",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.5 : 1,
                  fontFamily: "var(--font-space-grotesk)",
                  transition: "all 0.2s",
                }}
              >
                {saving ? "Saving..." : editing ? "Update Event" : "Create Event"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  style={{
                    padding: "10px 20px",
                    fontSize: "0.7rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "4px",
                    color: "rgba(255,255,255,0.35)",
                    cursor: "pointer",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Events List */}
        <div>
          <h2
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              marginBottom: 16,
            }}
          >
            All Events ({events.length})
          </h2>

          {loading ? (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>Loading...</p>
          ) : events.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>No events yet.</p>
          ) : (
            events.map((ev) => (
              <div
                key={ev.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  padding: "16px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                    <span
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      {ev.full}
                    </span>
                    <span
                      style={{
                        fontSize: "0.48rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.3)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        padding: "2px 8px",
                      }}
                    >
                      {ev.tag}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>
                    {ev.date} · {ev.location}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => startEdit(ev)}
                    style={{
                      padding: "6px 14px",
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "3px",
                      color: "rgba(255,255,255,0.5)",
                      cursor: "pointer",
                      fontFamily: "var(--font-space-grotesk)",
                    }}
                  >
                    Edit
                  </button>
                  {deleteConfirm === ev.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(ev.id)}
                        style={{
                          padding: "6px 14px",
                          fontSize: "0.6rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          background: "rgba(239,68,68,0.12)",
                          border: "1px solid rgba(239,68,68,0.25)",
                          borderRadius: "3px",
                          color: "rgb(252,165,165)",
                          cursor: "pointer",
                          fontFamily: "var(--font-space-grotesk)",
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        style={{
                          padding: "6px 10px",
                          fontSize: "0.6rem",
                          background: "transparent",
                          border: "1px solid rgba(255,255,255,0.05)",
                          borderRadius: "3px",
                          color: "rgba(255,255,255,0.3)",
                          cursor: "pointer",
                          fontFamily: "var(--font-space-grotesk)",
                        }}
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(ev.id)}
                      style={{
                        padding: "6px 14px",
                        fontSize: "0.6rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "3px",
                        color: "rgba(255,255,255,0.3)",
                        cursor: "pointer",
                        fontFamily: "var(--font-space-grotesk)",
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
