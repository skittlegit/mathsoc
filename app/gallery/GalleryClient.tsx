"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─── Deterministic shuffle ─── */
function shuffle<T>(arr: T[], seed = 42): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── Inline auto-play video ─── */
function GalleryVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      }}
    />
  );
}

/* ─── Lightbox ─── */
function Lightbox({
  src,
  all,
  onClose,
  onNavigate,
}: {
  src: string;
  all: string[];
  onClose: () => void;
  onNavigate: (idx: number) => void;
}) {
  const idx = all.indexOf(src);
  const isVideo = /\.(mp4|webm|mov)$/i.test(decodeURIComponent(src));

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && idx < all.length - 1) onNavigate(idx + 1);
      if (e.key === "ArrowLeft" && idx > 0) onNavigate(idx - 1);
    },
    [idx, all.length, onClose, onNavigate]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 24,
          right: 28,
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.5)",
          fontSize: "0.62rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        Close
      </button>

      {/* Prev */}
      {idx > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(idx - 1);
          }}
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 4,
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "rgba(255,255,255,0.6)",
            fontSize: "1.2rem",
            zIndex: 10,
          }}
        >
          ‹
        </button>
      )}

      {/* Next */}
      {idx < all.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(idx + 1);
          }}
          style={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 4,
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "rgba(255,255,255,0.6)",
            fontSize: "1.2rem",
            zIndex: 10,
          }}
        >
          ›
        </button>
      )}

      {/* Content */}
      <motion.div
        key={src}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25, ease }}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw",
          maxHeight: "85vh",
          overflow: "hidden",
        }}
      >
        {isVideo ? (
          <video
            src={src}
            controls
            autoPlay
            muted
            loop
            playsInline
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              objectFit: "contain",
              display: "block",
            }}
          />
        )}
      </motion.div>

      {/* Counter */}
      <span
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "0.5rem",
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.22)",
          fontFamily: "var(--font-jetbrains-mono)",
        }}
      >
        {idx + 1} / {all.length}
      </span>
    </motion.div>
  );
}

/* ─── Masonry layout using CSS columns ─── */
export default function GalleryClient({
  images,
  videos,
}: {
  images: string[];
  videos: string[];
}) {
  const all = shuffle([...images, ...videos]);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  return (
    <div style={{ paddingTop: 72, minHeight: "100vh" }}>
      {/* Header */}
      <div className="px-7 md:px-14" style={{ paddingTop: 48, paddingBottom: 24 }}>
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease }}
          style={{
            fontSize: "0.48rem",
            letterSpacing: "0.4em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            display: "block",
            marginBottom: 10,
          }}
        >
          Photos &amp; Videos
        </motion.span>
        <motion.h1
          className="font-bold uppercase"
          style={{
            fontSize: "clamp(2.2rem, 7vw, 6rem)",
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.88)",
            lineHeight: 0.9,
            marginBottom: 8,
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease }}
        >
          Gallery
        </motion.h1>
        <motion.p
          style={{
            fontSize: "0.48rem",
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.18)",
            textTransform: "uppercase",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          {images.length} photos · {videos.length} videos · click to view
        </motion.p>
      </div>

      {/* Masonry grid */}
      <motion.div
        className="px-3 md:px-7 pb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.7 }}
        style={{
          columnCount: 2,
          columnGap: 6,
        }}
      >
        <style jsx>{`
          @media (min-width: 640px) {
            .masonry-grid {
              column-count: 3 !important;
            }
          }
          @media (min-width: 900px) {
            .masonry-grid {
              column-count: 4 !important;
            }
          }
          @media (min-width: 1280px) {
            .masonry-grid {
              column-count: 5 !important;
            }
          }
        `}</style>
        <div className="masonry-grid" style={{ columnCount: 2, columnGap: 6 }}>
          {all.map((src, i) => {
            const isVideo = /\.(mp4|webm|mov)$/i.test(
              decodeURIComponent(src)
            );
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.5, delay: (i % 5) * 0.03 }}
                onClick={() => setLightboxIdx(i)}
                style={{
                  marginBottom: 6,
                  overflow: "hidden",
                  cursor: "pointer",
                  breakInside: "avoid",
                  background: "#000510",
                }}
              >
                {isVideo ? (
                  <GalleryVideo src={src} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    style={{
                      width: "100%",
                      display: "block",
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            src={all[lightboxIdx]}
            all={all}
            onClose={() => setLightboxIdx(null)}
            onNavigate={(idx) => setLightboxIdx(idx)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
