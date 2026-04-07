"use client";

import { useState, useEffect, useCallback } from "react";

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
};

function slugify(text: string, year: number) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") +
    "-" +
    year
  );
}

export default function AdminPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState<EventItem>({ ...emptyEvent });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setEvents(data);
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

    const payload = {
      ...form,
      id: form.id || slugify(form.title, form.year),
    };

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
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
    setForm({ ...ev });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setForm({ ...emptyEvent });
    setEditing(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/events?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
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
              <div>
                <label style={labelStyle}>Tag</label>
                <select
                  style={{ ...inputStyle, cursor: "pointer" }}
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                >
                  {TAGS.map((t) => (
                    <option key={t} value={t} style={{ background: "#0a0a0a" }}>
                      {t}
                    </option>
                  ))}
                </select>
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

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Photo URL (optional)</label>
              <input
                style={inputStyle}
                value={form.photo ?? ""}
                onChange={(e) => setForm({ ...form, photo: e.target.value })}
                placeholder="https://... or /images/..."
              />
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
