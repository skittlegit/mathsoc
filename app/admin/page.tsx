"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback, useRef } from "react";
import { signInAnonymously } from "firebase/auth";
import { collection, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";

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
  photoPosition?: string;
  photoScale?: number;
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
  photoPosition: "50% 50%",
  photoScale: 1,
  content: "",
  gallery: [],
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

type SaveStatus = "idle" | "saving" | "saved" | "error";

/* ─────────────────────────────────────────────────
   Shared style atoms
───────────────────────────────────────────────── */
const inputBase: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  fontSize: "0.85rem",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: "4px",
  color: "rgba(255,255,255,0.88)",
  outline: "none",
  fontFamily: "var(--font-space-grotesk)",
  transition: "border-color 0.15s",
};

const lbl: React.CSSProperties = {
  display: "block",
  fontSize: "0.52rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.38)",
  marginBottom: "7px",
  fontFamily: "var(--font-space-grotesk)",
};

function SectionDivider({ title }: { title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "28px 0 18px" }}>
      <span style={{ ...lbl, margin: 0, whiteSpace: "nowrap" }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────── */
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwdInput, setPwdInput] = useState("");
  const [pwdError, setPwdError] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState<EventItem>({ ...emptyEvent });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState("");
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  /* Drag-to-crop — use ref to avoid stale closures during rapid pointer moves */
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startPosX: 50,
    startPosY: 50,
  });

  /* ── File upload helper — uses Firebase Storage ── */
  const uploadFile = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const allowed = ["jpg", "jpeg", "png", "gif", "webp", "avif"];
    if (!allowed.includes(ext)) throw new Error("File type not allowed");
    const fileRef = storageRef(storage, `events/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  /* ── Fetch events from Firestore ── */
  const fetchEvents = useCallback(async () => {
    try {
      const snap = await getDocs(collection(db, "events"));
      const list: EventItem[] = snap.docs
        .map((d) => {
          const data = d.data();
          return { ...data, id: d.id, slug: data.slug || d.id } as unknown as EventItem;
        })
        .sort((a, b) => b.year - a.year || b.date.localeCompare(a.date));
      setEvents(list);
    } catch {
      setSaveError("Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  /* ── Submit / save via /api/events ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");
    setSaveError("");

    try {
      const slug =
        form.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-") +
        "-" +
        form.year;

      // For new events generate an id from the slug
      const id = form.id || slug;

      const payload = {
        id,
        slug,
        year: form.year,
        date: form.date,
        title: form.title,
        full: form.full || form.title,
        location: form.location,
        desc: form.desc,
        tag: form.tag,
        ...(form.photo ? { photo: form.photo } : {}),
        photoPosition: form.photoPosition || "50% 50%",
        photoScale: form.photoScale || 1,
        ...(form.content ? { content: form.content } : {}),
        gallery: Array.isArray(form.gallery) ? form.gallery : [],
      };

      await setDoc(doc(db, "events", id), payload);
      setSaveStatus("saved");
      setLastSavedId(id);
      setTimeout(() => setSaveStatus("idle"), 3500);
      setTimeout(() => setLastSavedId(null), 6000);

      setForm({ ...emptyEvent });
      setEditing(false);
      await fetchEvents();
    } catch (err) {
      setSaveStatus("error");
      setSaveError(err instanceof Error ? err.message : "Save failed");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  };

  const startEdit = (ev: EventItem) => {
    setForm({ ...ev, gallery: ev.gallery ?? [] });
    setEditing(true);
    setSaveStatus("idle");
    setSaveError("");
    setTimeout(
      () => formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50
    );
  };

  const cancelEdit = () => {
    setForm({ ...emptyEvent });
    setEditing(false);
    setSaveStatus("idle");
    setSaveError("");
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "events", id));
      setDeleteConfirm(null);
      if (form.id === id) cancelEdit();
      await fetchEvents();
    } catch {
      setSaveError("Delete failed");
    }
  };

  const seedFromBackup = async () => {
    try {
      const res = await fetch("/api/events");
      if (!res.ok) return;
      const list = await res.json() as EventItem[];
      await Promise.all(list.map((ev) => setDoc(doc(db, "events", ev.id), { ...ev, slug: ev.slug || ev.id })));
      await fetchEvents();
    } catch {
      setSaveError("Seed failed");
    }
  };

  /* ── Drag-to-crop handlers (React synthetic events + pointer capture) ── */
  const handleCropDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = "grabbing";
    const parts = (form.photoPosition || "50% 50%").split(" ");
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startPosX: parseFloat(parts[0]) || 50,
      startPosY: parseFloat(parts[1]) || 50,
    };
  };

  const handleCropMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || !cropContainerRef.current) return;
    const { startX, startY, startPosX, startPosY } = dragRef.current;
    const w = cropContainerRef.current.clientWidth;
    const h = cropContainerRef.current.clientHeight;
    /* Sensitivity: dragging full frame width ≈ 150% of 0-100 range */
    const newX = clamp(startPosX - ((e.clientX - startX) / w) * 150, 0, 100);
    const newY = clamp(startPosY - ((e.clientY - startY) / h) * 150, 0, 100);
    setForm((f) => ({ ...f, photoPosition: `${Math.round(newX)}% ${Math.round(newY)}%` }));
  };

  const handleCropUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current.active = false;
    e.currentTarget.style.cursor = "grab";
  };

  /* ─────────────────────────────────────────────────
     PASSWORD GATE
  ───────────────────────────────────────────────── */
  const handleAuth = async () => {
    if (pwdInput !== "geometrystinks") { setPwdError(true); return; }
    setAuthLoading(true);
    try {
      await signInAnonymously(auth);
      setAuthed(true);
    } catch {
      setPwdError(true);
    } finally {
      setAuthLoading(false);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-7">
        <span
          style={{
            fontSize: "0.5rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            marginBottom: 32,
            display: "block",
          }}
        >
          Admin Panel
        </span>
        <div style={{ width: "100%", maxWidth: 340 }}>
          <label style={lbl}>Password</label>
          <input
            type="password"
            value={pwdInput}
            autoFocus
            onChange={(e) => {
              setPwdInput(e.target.value);
              setPwdError(false);
            }}
            onKeyDown={(e) => { if (e.key === "Enter") handleAuth(); }}
            style={{
              ...inputBase,
              borderColor: pwdError ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.09)",
            }}
            placeholder="Enter password"
          />
          {pwdError && (
            <p style={{ fontSize: "0.65rem", color: "rgb(252,165,165)", marginTop: 8 }}>
              Incorrect password.
            </p>
          )}
          <button
            onClick={handleAuth}
            disabled={authLoading}
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
              cursor: authLoading ? "not-allowed" : "pointer",
              fontFamily: "var(--font-space-grotesk)",
              opacity: authLoading ? 0.5 : 1,
            }}
          >
            {authLoading ? "Signing in…" : "Access"}
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────
     MAIN ADMIN PANEL
  ───────────────────────────────────────────────── */
  const saveBtnStyle: React.CSSProperties =
    saveStatus === "saved"
      ? { background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.35)", color: "rgb(134,239,172)" }
      : saveStatus === "error"
      ? { background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "rgb(252,165,165)" }
      : { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)" };

  return (
    <div className="pt-28 md:pt-36 pb-28">
      <div className="px-5 md:px-14 max-w-5xl mx-auto">

        {/* ── Page Header ── */}
        <div ref={formTopRef} style={{ marginBottom: 36 }}>
          <span
            style={{
              fontSize: "0.5rem",
              letterSpacing: "0.4em",
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
            }}
          >
            Admin Panel
          </span>
          <h1
            className="font-bold uppercase mt-3"
            style={{
              fontSize: "clamp(2.2rem, 7vw, 4rem)",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.9)",
              lineHeight: 0.95,
            }}
          >
            Events
          </h1>
        </div>

        {/* ══════════════════ FORM ══════════════════ */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "28px",
            border: `1px solid ${editing ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)"}`,
            borderRadius: "8px",
            background: editing ? "rgba(255,255,255,0.022)" : "rgba(255,255,255,0.012)",
            marginBottom: 44,
            transition: "border-color 0.3s, background 0.3s",
          }}
        >
          {/* Form title row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <h2
              style={{
                fontSize: "0.88rem",
                fontWeight: 600,
                color: editing ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.5)",
                letterSpacing: "0.03em",
                margin: 0,
              }}
            >
              {editing ? `Editing — ${form.full || form.title || "event"}` : "New Event"}
            </h2>
            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                style={{
                  fontSize: "0.55rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.28)",
                  cursor: "pointer",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                Cancel ×
              </button>
            )}
          </div>

          {/* ── Details ── */}
          <SectionDivider title="Event Details" />

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}
          >
            <div>
              <label style={lbl}>Short Title</label>
              <input
                style={inputBase}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. MCSE"
                required
              />
            </div>
            <div>
              <label style={lbl}>Full Title</label>
              <input
                style={inputBase}
                value={form.full}
                onChange={(e) => setForm({ ...form, full: e.target.value })}
                placeholder="e.g. Math Club Stock Exchange"
                required
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 14,
              marginBottom: 14,
            }}
          >
            <div>
              <label style={lbl}>Date</label>
              <input
                style={inputBase}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="APR 5, 2025"
                required
              />
            </div>
            <div>
              <label style={lbl}>Year</label>
              <input
                style={inputBase}
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                min={2020}
                max={2099}
                required
              />
            </div>
            <div>
              <label style={lbl}>Location</label>
              <input
                style={inputBase}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. ECR-5"
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Category</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 4 }}>
              {TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, tag: t })}
                  style={{
                    padding: "7px 18px",
                    fontSize: "0.6rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    borderRadius: "3px",
                    border: "1px solid",
                    borderColor:
                      form.tag === t ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.08)",
                    background:
                      form.tag === t ? "rgba(255,255,255,0.1)" : "transparent",
                    color:
                      form.tag === t ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.38)",
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

          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Short Description</label>
            <textarea
              style={{ ...inputBase, minHeight: 90, resize: "vertical" }}
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              placeholder="Brief event summary shown on event cards…"
              required
            />
          </div>

          {/* ── Cover Photo ── */}
          <SectionDivider title="Cover Photo" />

          <div style={{ marginBottom: 14 }}>
            <div
              style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}
            >
              <button
                type="button"
                disabled={uploadingCover}
                onClick={() => coverInputRef.current?.click()}
                style={{
                  padding: "8px 16px",
                  fontSize: "0.62rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "4px",
                  color: uploadingCover ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.65)",
                  cursor: uploadingCover ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-space-grotesk)",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {uploadingCover ? "Uploading…" : "↑ Upload Image"}
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
                    setSaveError("Cover upload failed");
                  } finally {
                    setUploadingCover(false);
                    e.target.value = "";
                  }
                }}
              />
              <input
                style={{ ...inputBase, fontSize: "0.78rem", flex: 1, minWidth: 0 }}
                value={form.photo ?? ""}
                onChange={(e) => setForm({ ...form, photo: e.target.value })}
                placeholder="Or paste an image URL directly…"
              />
            </div>

            {/* Drag-to-reposition crop frame */}
            {form.photo && (
              <div>
                <label style={{ ...lbl, marginBottom: 8 }}>
                  Drag to reposition · 21 : 9 crop preview
                </label>
                <div
                  ref={cropContainerRef}
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "21/9",
                    overflow: "hidden",
                    borderRadius: 4,
                    border: "1px solid rgba(255,255,255,0.1)",
                    cursor: "grab",
                    touchAction: "none",
                    userSelect: "none",
                  }}
                  onPointerDown={handleCropDown}
                  onPointerMove={handleCropMove}
                  onPointerUp={handleCropUp}
                  onPointerCancel={handleCropUp}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.photo}
                    alt="Crop preview"
                    draggable={false}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: form.photoPosition || "50% 50%",
                      transform: `scale(${form.photoScale || 1})`,
                      transformOrigin: form.photoPosition || "50% 50%",
                      display: "block",
                      pointerEvents: "none",
                    }}
                  />
                  {/* Rule-of-thirds grid */}
                  <div
                    style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
                  >
                    {(["33.33%", "66.66%"] as const).map((p) => (
                      <div
                        key={`v-${p}`}
                        style={{
                          position: "absolute",
                          left: p,
                          top: 0,
                          bottom: 0,
                          width: 1,
                          background: "rgba(255,255,255,0.14)",
                        }}
                      />
                    ))}
                    {(["33.33%", "66.66%"] as const).map((p) => (
                      <div
                        key={`h-${p}`}
                        style={{
                          position: "absolute",
                          top: p,
                          left: 0,
                          right: 0,
                          height: 1,
                          background: "rgba(255,255,255,0.14)",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.52rem",
                      color: "rgba(255,255,255,0.3)",
                      fontFamily: "var(--font-jetbrains-mono)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    position: {form.photoPosition || "50% 50%"} · zoom: {(form.photoScale || 1).toFixed(1)}×
                  </span>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, photoPosition: "50% 50%", photoScale: 1 }))}
                    style={{
                      fontSize: "0.52rem",
                      color: "rgba(255,255,255,0.45)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontFamily: "var(--font-space-grotesk)",
                    }}
                  >
                    Reset center
                  </button>
                </div>
                {/* Zoom slider */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                  <span style={{ ...lbl, margin: 0, whiteSpace: "nowrap" }}>Zoom 1×</span>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.05}
                    value={form.photoScale || 1}
                    onChange={(e) => setForm((f) => ({ ...f, photoScale: parseFloat(e.target.value) }))}
                    style={{ flex: 1, accentColor: "rgba(255,255,255,0.55)", cursor: "pointer" }}
                  />
                  <span style={{ ...lbl, margin: 0, whiteSpace: "nowrap" }}>3×</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Gallery ── */}
          <SectionDivider title="Gallery Images" />

          <div style={{ marginBottom: 14 }}>
            <div style={{ marginBottom: 12 }}>
              <button
                type="button"
                disabled={uploadingGallery}
                onClick={() => galleryInputRef.current?.click()}
                style={{
                  padding: "8px 16px",
                  fontSize: "0.62rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "4px",
                  color: uploadingGallery ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.65)",
                  cursor: uploadingGallery ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                {uploadingGallery ? "Uploading…" : "↑ Add Images"}
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
                    setForm((f) => ({
                      ...f,
                      gallery: [...(f.gallery ?? []), ...urls],
                    }));
                  } catch {
                    setSaveError("One or more uploads failed");
                  } finally {
                    setUploadingGallery(false);
                    e.target.value = "";
                  }
                }}
              />
            </div>

            {(form.gallery ?? []).length > 0 ? (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  {(form.gallery ?? []).map((url, i) => (
                    <div
                      key={i}
                      style={{
                        position: "relative",
                        borderRadius: 4,
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Gallery ${i + 1}`}
                        onClick={() => setLightboxImg(url)}
                        style={{
                          height: 72,
                          width: "100%",
                          objectFit: "cover",
                          display: "block",
                          cursor: "zoom-in",
                        }}
                      />
                      {/* Hover overlay */}
                      <div
                        onClick={() => setLightboxImg(url)}
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(0,0,0,0)",
                          cursor: "zoom-in",
                          transition: "background 0.15s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "rgba(0,0,0,0.4)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "rgba(0,0,0,0)")
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            gallery: (f.gallery ?? []).filter((_, j) => j !== i),
                          }))
                        }
                        style={{
                          position: "absolute",
                          top: 3,
                          right: 3,
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: "rgba(0,0,0,0.75)",
                          border: "none",
                          color: "rgba(255,255,255,0.85)",
                          fontSize: "0.75rem",
                          lineHeight: 1,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 2,
                        }}
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <p
                  style={{
                    fontSize: "0.52rem",
                    color: "rgba(255,255,255,0.3)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {form.gallery?.length} image{form.gallery?.length !== 1 ? "s" : ""} · click any
                  to preview
                </p>
              </>
            ) : (
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.2)",
                  fontStyle: "italic",
                }}
              >
                No gallery images yet.
              </p>
            )}
          </div>

          {/* ── Full Content ── */}
          <SectionDivider title="Full Content (event detail page)" />

          <div style={{ marginBottom: 24 }}>
            <textarea
              style={{ ...inputBase, minHeight: 150, resize: "vertical" }}
              value={form.content ?? ""}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Full event write-up. Blank lines = paragraph breaks."
            />
          </div>

          {/* ── Save row ── */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={saveStatus === "saving"}
              style={{
                padding: "11px 32px",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                borderRadius: "5px",
                cursor: saveStatus === "saving" ? "not-allowed" : "pointer",
                fontFamily: "var(--font-space-grotesk)",
                transition: "all 0.3s",
                ...saveBtnStyle,
              }}
            >
              {saveStatus === "saving"
                ? "Saving…"
                : saveStatus === "saved"
                ? "✓ Saved"
                : saveStatus === "error"
                ? "Failed — retry?"
                : editing
                ? "Update Event"
                : "Create Event"}
            </button>

            {editing && saveStatus === "idle" && (
              <button
                type="button"
                onClick={cancelEdit}
                style={{
                  padding: "11px 20px",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "5px",
                  color: "rgba(255,255,255,0.32)",
                  cursor: "pointer",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                Cancel
              </button>
            )}

            {saveStatus === "saved" && (
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "rgb(134,239,172)",
                  letterSpacing: "0.08em",
                }}
              >
                Changes saved to Firestore ✓
              </span>
            )}
            {saveStatus === "error" && saveError && (
              <span style={{ fontSize: "0.65rem", color: "rgb(252,165,165)" }}>
                {saveError}
              </span>
            )}
          </div>
        </form>

        {/* ══════════════════ EVENTS LIST ══════════════════ */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: "0.52rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              All Events
            </span>
            <span
              style={{
                fontSize: "0.52rem",
                color: "rgba(255,255,255,0.22)",
                fontFamily: "var(--font-jetbrains-mono)",
              }}
            >
              ({events.length})
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
          </div>

          {loading ? (
            <div
              style={{
                display: "flex",
                gap: 14,
                alignItems: "center",
                padding: "20px 0",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.08)",
                  borderTopColor: "rgba(255,255,255,0.45)",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>
                Loading…
              </span>
            </div>
          ) : events.length === 0 ? (
            <p
              style={{
                fontSize: "0.82rem",
                color: "rgba(255,255,255,0.28)",
                padding: "16px 0",
                fontStyle: "italic",
              }}
            >
              No events yet. Create the first one above, or{" "}
              <button
                onClick={seedFromBackup}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.45)",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "inherit",
                  fontFamily: "var(--font-space-grotesk)",
                  padding: 0,
                }}
              >
                import existing events from backup
              </button>
              .
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {events.map((ev) => {
                const isActive = form.id === ev.id && editing;
                const justSaved = lastSavedId === ev.id;
                return (
                  <div
                    key={ev.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "12px 14px",
                      borderRadius: 6,
                      background: isActive
                        ? "rgba(255,255,255,0.05)"
                        : justSaved
                        ? "rgba(34,197,94,0.06)"
                        : "transparent",
                      border: isActive
                        ? "1px solid rgba(255,255,255,0.1)"
                        : justSaved
                        ? "1px solid rgba(34,197,94,0.15)"
                        : "1px solid rgba(255,255,255,0.03)",
                      transition: "background 0.8s ease, border-color 0.5s",
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: 56,
                        height: 40,
                        flexShrink: 0,
                        borderRadius: 3,
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {ev.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={ev.photo}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: ev.photoPosition || "center",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.07)" }}
                          >
                            ∑
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 3,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.88rem",
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.82)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {ev.full || ev.title}
                        </span>
                        {justSaved && (
                          <span
                            style={{
                              fontSize: "0.44rem",
                              letterSpacing: "0.15em",
                              textTransform: "uppercase",
                              color: "rgb(134,239,172)",
                              background: "rgba(34,197,94,0.12)",
                              padding: "2px 8px",
                              borderRadius: 2,
                              flexShrink: 0,
                            }}
                          >
                            ✓ Updated
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: "0.44rem",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.28)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            padding: "1px 7px",
                            flexShrink: 0,
                          }}
                        >
                          {ev.tag}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: "0.65rem",
                          color: "rgba(255,255,255,0.38)",
                          margin: 0,
                        }}
                      >
                        {ev.date}
                        {ev.location ? ` · ${ev.location}` : ""}
                      </p>
                    </div>

                    {/* Actions */}
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        flexShrink: 0,
                        alignItems: "center",
                      }}
                    >
                      {!isActive && (
                        <button
                          onClick={() => startEdit(ev)}
                          style={{
                            padding: "6px 14px",
                            fontSize: "0.58rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.09)",
                            borderRadius: "3px",
                            color: "rgba(255,255,255,0.55)",
                            cursor: "pointer",
                            fontFamily: "var(--font-space-grotesk)",
                          }}
                        >
                          Edit
                        </button>
                      )}
                      {deleteConfirm === ev.id ? (
                        <>
                          <button
                            onClick={() => handleDelete(ev.id)}
                            style={{
                              padding: "6px 14px",
                              fontSize: "0.58rem",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              background: "rgba(239,68,68,0.15)",
                              border: "1px solid rgba(239,68,68,0.3)",
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
                              fontSize: "0.62rem",
                              background: "transparent",
                              border: "1px solid rgba(255,255,255,0.06)",
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
                            fontSize: "0.58rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            background: "transparent",
                            border: "1px solid rgba(255,255,255,0.05)",
                            borderRadius: "3px",
                            color: "rgba(255,255,255,0.28)",
                            cursor: "pointer",
                            fontFamily: "var(--font-space-grotesk)",
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════ GALLERY LIGHTBOX ══════════════════ */}
      {lightboxImg && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.96)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
          onClick={() => setLightboxImg(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxImg}
            alt="Preview"
            style={{
              maxWidth: "92vw",
              maxHeight: "88vh",
              objectFit: "contain",
              borderRadius: 4,
              cursor: "default",
              boxShadow: "0 0 80px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightboxImg(null)}
            style={{
              position: "absolute",
              top: 24,
              right: 28,
              fontSize: "1.5rem",
              lineHeight: 1,
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
            }}
            aria-label="Close preview"
          >
            ×
          </button>
        </div>
      )}

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
