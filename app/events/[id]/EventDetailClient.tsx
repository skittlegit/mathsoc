"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { EventItem } from "@/lib/types";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function EventDetailClient({ event }: { event: EventItem }) {
  const galleryItems = event.gallery ?? [];
  const bodyText = event.content || event.desc;
  const [lightbox, setLightbox] = useState<number | null>(null);

  /* Keyboard nav for lightbox */
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((lightbox + 1) % galleryItems.length);
      if (e.key === "ArrowLeft") setLightbox((lightbox - 1 + galleryItems.length) % galleryItems.length);
    },
    [lightbox, galleryItems.length],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100 }}>
      {/* ── Hero cover ── */}
      {event.photo && (
        <div style={{ position: "relative", width: "100%" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              width: "100%",
              aspectRatio: "21/9",
              minHeight: 280,
              maxHeight: 520,
              overflow: "hidden",
              background: "#03050d",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.photo}
              alt={event.full}
              loading="eager"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: event.photoPosition || "center",
                transform: `scale(${event.photoScale || 1})`,
                transformOrigin: event.photoPosition || "center",
                display: "block",
              }}
            />
          </motion.div>
          {/* Gradient fade */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 120,
              background: "linear-gradient(to top, #000 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
          {/* Back link over image */}
          <div
            className="page-container"
            style={{ position: "absolute", top: 0, left: 0, right: 0, paddingTop: 96 }}
          >
            <BackLink shadow />
          </div>
        </div>
      )}

      {/* No image — just back link */}
      {!event.photo && (
        <div className="page-container" style={{ paddingTop: 104 }}>
          <BackLink />
        </div>
      )}

      {/* ── Header + body ── */}
      <div
        className="page-container"
        style={{ marginTop: event.photo ? -20 : 32, position: "relative", zIndex: 2 }}
      >
        {/* Title */}
        <motion.h1
          className="font-bold uppercase"
          style={{
            fontSize: "clamp(2rem, 6vw, 5.5rem)",
            letterSpacing: "0.06em",
            lineHeight: 0.95,
            color: "var(--c-text)",
            marginBottom: 24,
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
        >
          {event.full}
        </motion.h1>

        {/* Meta row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3 flex-wrap"
          style={{ marginBottom: 48 }}
        >
          <span style={{ fontSize: "0.82rem", color: "var(--c-text-muted)", fontWeight: 600 }}>
            {event.date}
          </span>
          {event.location && (
            <>
              <span className="sep-dot" />
              <span className="meta-mono" style={{ fontSize: "0.72rem" }}>
                {event.location}
              </span>
            </>
          )}
          {event.link && (
            <>
              <span className="sep-dot" />
              <a
                href={event.link.startsWith("http") ? event.link : `https://${event.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="meta-mono"
                style={{
                  fontSize: "0.72rem",
                  color: "var(--c-text-3)",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  textDecorationColor: "rgba(255,255,255,0.2)",
                }}
              >
                {event.link.replace(/^https?:\/\//, "")} ↗
              </a>
            </>
          )}
          <span className="tag-badge">{event.tag}</span>
          {event.author && (
            <>
              <span className="sep-dot" />
              <span className="meta-mono" style={{ fontSize: "0.65rem", fontStyle: "italic" }}>
                by {event.author}
              </span>
            </>
          )}
        </motion.div>

        {/* Body content */}
        <motion.div
          className="prose-body"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: EASE }}
          style={{ borderTop: "1px solid var(--c-border)", paddingTop: 40, maxWidth: 680 }}
        >
          {bodyText.split("\n").map((para, i) =>
            para.trim() ? <p key={i}>{para}</p> : <div key={i} style={{ height: 8 }} />,
          )}
        </motion.div>
      </div>

      {/* ── Event Gallery ── */}
      {galleryItems.length > 0 && (
        <div style={{ marginTop: 80 }}>
          <div className="page-container" style={{ marginBottom: 24 }}>
            <span className="eyebrow">
              Event Gallery · {galleryItems.length} photos
            </span>
          </div>

          <div
            className="page-container"
            style={{
              columnCount: galleryItems.length === 1 ? 1 : galleryItems.length === 2 ? 2 : undefined,
              columns: galleryItems.length > 2 ? "280px 3" : undefined,
              columnGap: 6,
            }}
          >
            {galleryItems.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
                onClick={() => setLightbox(i)}
                style={{
                  breakInside: "avoid",
                  marginBottom: 6,
                  overflow: "hidden",
                  background: "#03050d",
                  cursor: "pointer",
                  borderRadius: 2,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  style={{ width: "100%", height: "auto", display: "block", transition: "transform 0.4s ease" }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightbox(null)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              key={lightbox}
              src={galleryItems[lightbox]}
              alt=""
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", borderRadius: 2 }}
              onClick={(e) => e.stopPropagation()}
            />
            {galleryItems.length > 1 && (
              <>
                <button
                  className="lightbox-nav"
                  style={{ left: 16 }}
                  onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + galleryItems.length) % galleryItems.length); }}
                >
                  ‹
                </button>
                <button
                  className="lightbox-nav"
                  style={{ right: 16 }}
                  onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % galleryItems.length); }}
                >
                  ›
                </button>
              </>
            )}
            <button
              onClick={() => setLightbox(null)}
              style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 24, cursor: "pointer" }}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Back link ── */
function BackLink({ shadow = false }: { shadow?: boolean }) {
  return (
    <Link
      href="/events"
      className="eyebrow"
      style={{
        fontSize: "0.52rem",
        letterSpacing: "0.2em",
        color: "rgba(255,255,255,0.6)",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        textDecoration: "none",
        ...(shadow ? { textShadow: "0 1px 8px rgba(0,0,0,0.5)" } : {}),
      }}
    >
      ← All Events
    </Link>
  );
}
