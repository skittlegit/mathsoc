"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { EventItem } from "@/lib/types";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function EventDetailClient({ event }: { event: EventItem }) {
  const galleryItems = event.gallery ?? [];
  const bodyText = event.content || event.desc;

  return (
    <div style={{ paddingTop: 72, minHeight: "100vh", paddingBottom: 100 }}>
      {/* Back nav */}
      <div
        className="px-7 md:px-14 max-w-6xl mx-auto"
        style={{ paddingTop: 32, paddingBottom: 0 }}
      >
        <Link
          href="/events"
          style={{
            fontSize: "0.52rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            transition: "color 0.2s",
          }}
        >
          ← All Events
        </Link>
      </div>

      {/* Cover image — full bleed */}
      {event.photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            width: "100%",
            aspectRatio: "21/9",
            overflow: "hidden",
            marginTop: 32,
            background: "#03050d",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.photo}
            alt={event.full}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </motion.div>
      )}

      {/* Header */}
      <div
        className="px-7 md:px-14 max-w-6xl mx-auto"
        style={{ paddingTop: event.photo ? 48 : 64 }}
      >
        {/* Meta row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
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
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.5)",
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
              color: "rgba(255,255,255,0.45)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "2px 8px",
              textTransform: "uppercase",
            }}
          >
            {event.tag}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-bold uppercase"
          style={{
            fontSize: "clamp(2.2rem, 6vw, 6rem)",
            letterSpacing: "0.08em",
            lineHeight: 0.95,
            color: "rgba(255,255,255,0.92)",
            marginBottom: 56,
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease }}
        >
          {event.full}
        </motion.h1>

        {/* Body content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease }}
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
                  color: "rgba(255,255,255,0.72)",
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
                color: "rgba(255,255,255,0.35)",
              }}
            >
              Event Gallery
            </span>
          </div>

          {/* Image grid — reduced margins */}
          <div
            className="px-2 sm:px-4"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 6,
            }}
          >
            {galleryItems.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                style={{
                  aspectRatio: "4/3",
                  overflow: "hidden",
                  background: "#03050d",
                  cursor: "pointer",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
