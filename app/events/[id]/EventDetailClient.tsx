"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { EventItem } from "@/lib/types";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function EventDetailClient({ event }: { event: EventItem }) {
  const galleryItems = event.gallery ?? [];
  const bodyText = event.content || event.desc;
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100 }}>
      {/* Hero cover — edge-to-edge with gradient overlay */}
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
          {/* Gradient fade into content */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 120,
              background:
                "linear-gradient(to top, #000 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
          {/* Back link over image */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              paddingTop: 96,
            }}
            className="px-7 md:px-14 max-w-6xl mx-auto"
          >
            <Link
              href="/events"
              style={{
                fontSize: "0.52rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
                textShadow: "0 1px 8px rgba(0,0,0,0.5)",
              }}
            >
              ← All Events
            </Link>
          </div>
        </div>
      )}

      {/* No image — just back link */}
      {!event.photo && (
        <div
          className="px-7 md:px-14 max-w-6xl mx-auto"
          style={{ paddingTop: 104 }}
        >
          <Link
            href="/events"
            style={{
              fontSize: "0.52rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
            }}
          >
            ← All Events
          </Link>
        </div>
      )}

      {/* Header section */}
      <div
        className="px-7 md:px-14 max-w-6xl mx-auto"
        style={{ marginTop: event.photo ? -20 : 32, position: "relative", zIndex: 2 }}
      >
        {/* Title first — big and dominant */}
        <motion.h1
          className="font-bold uppercase"
          style={{
            fontSize: "clamp(2rem, 6vw, 5.5rem)",
            letterSpacing: "0.06em",
            lineHeight: 0.95,
            color: "rgba(255,255,255,0.94)",
            marginBottom: 24,
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease }}
        >
          {event.full}
        </motion.h1>

        {/* Meta row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 48,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.55)",
              fontWeight: 600,
            }}
          >
            {event.date}
          </span>
          <span
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.55)",
              fontFamily: "var(--font-jetbrains-mono)",
              letterSpacing: "0.1em",
            }}
          >
            {event.location}
          </span>
          <span
            style={{
              fontSize: "0.45rem",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "2px 10px",
              textTransform: "uppercase",
            }}
          >
            {event.tag}
          </span>
        </motion.div>

        {/* Body content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease }}
          style={{
            maxWidth: 680,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 40,
          }}
        >
          {bodyText.split("\n").map((para, i) =>
            para.trim() ? (
              <p
                key={i}
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "1rem",
                  lineHeight: 1.9,
                  marginBottom: 20,
                }}
              >
                {para}
              </p>
            ) : (
              <div key={i} style={{ height: 8 }} />
            )
          )}
        </motion.div>
      </div>

      {/* Event Gallery */}
      {galleryItems.length > 0 && (
        <div style={{ marginTop: 80 }}>
          <div
            className="px-7 md:px-14 max-w-6xl mx-auto"
            style={{ marginBottom: 24 }}
          >
            <span
              style={{
                fontSize: "0.48rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Event Gallery · {galleryItems.length} photos
            </span>
          </div>

          <div
            className="px-7 md:px-14 max-w-6xl mx-auto"
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
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    transition: "transform 0.4s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.03)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightbox(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "rgba(0,0,0,0.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              cursor: "zoom-out",
            }}
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
              style={{
                maxWidth: "90vw",
                maxHeight: "85vh",
                objectFit: "contain",
                borderRadius: 2,
              }}
              onClick={(e) => e.stopPropagation()}
            />
            {/* Nav arrows */}
            {galleryItems.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox(
                      (lightbox - 1 + galleryItems.length) %
                        galleryItems.length
                    );
                  }}
                  style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(255,255,255,0.08)",
                    border: "none",
                    borderRadius: "50%",
                    width: 44,
                    height: 44,
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox((lightbox + 1) % galleryItems.length);
                  }}
                  style={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(255,255,255,0.08)",
                    border: "none",
                    borderRadius: "50%",
                    width: 44,
                    height: 44,
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ›
                </button>
              </>
            )}
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.5)",
                fontSize: 24,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
