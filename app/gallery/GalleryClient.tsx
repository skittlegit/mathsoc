"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "@/lib/types";

export interface GalleryImage {
  src: string;
  w: number;
  h: number;
}

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
      preload="metadata"
      style={{
        position: "absolute",
        inset: 0,
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
  all: GalleryImage[];
  onClose: () => void;
  onNavigate: (idx: number) => void;
}) {
  const idx = all.findIndex((item) => item.src === src);
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
        transition={{ duration: 0.25, ease: EASE }}
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
          color: "rgba(255,255,255,0.38)",
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
  images: GalleryImage[];
  videos: string[];
}) {
  // Merge images and video placeholders into a single shuffled list
  const videoItems: GalleryImage[] = videos.map((src) => ({ src, w: 16, h: 9 }));
  const all = shuffle([...images, ...videoItems]);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [loadedSet, setLoadedSet] = useState<Set<number>>(new Set());

  return (
    <div style={{ paddingTop: 72, minHeight: "100vh" }}>
      {/* Header */}
      <div className="page-container" style={{ paddingTop: 48, paddingBottom: 32 }}>
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            fontSize: "0.56rem",
            letterSpacing: "0.4em",
            color: "rgba(255,255,255,0.55)",
            textTransform: "uppercase",
            display: "block",
            marginBottom: 10,
          }}
        >
          Photos &amp; Videos
        </motion.span>
        <motion.h1
          className="font-bold uppercase mt-6"
          style={{
            fontSize: "clamp(3.5rem, 11vw, 9rem)",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.9)",
            lineHeight: 0.9,
            marginBottom: 16,
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: EASE }}
        >
          Gallery
        </motion.h1>
        <motion.p
          style={{
            fontSize: "0.56rem",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.55)",
            textTransform: "uppercase",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          {images.length} photos &middot; {videos.length} videos &middot; click to view
        </motion.p>
      </div>

      {/* Masonry grid — full bleed, only tiny side padding */}
      <motion.div
        className="px-4 sm:px-6 pb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.7 }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @media (min-width: 640px) { .masonry-grid { column-count: 3 !important; } }
          @media (min-width: 900px) { .masonry-grid { column-count: 4 !important; } }
          @media (min-width: 1280px) { .masonry-grid { column-count: 5 !important; } }
        ` }} />
        <div className="masonry-grid" style={{ columnCount: 2, columnGap: 6 }}>
          {all.map((item, i) => {
            const isVideo = /\.(mp4|webm|mov)$/i.test(
              decodeURIComponent(item.src)
            );
            const aspectRatio = `${item.w} / ${item.h}`;
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
                  background: "#050a1c",
                  position: "relative",
                  aspectRatio,
                }}
              >
                {isVideo ? (
                  <GalleryVideo src={item.src} />
                ) : (
                  <>
                    {/* Skeleton shimmer — exact same aspect ratio */}
                    {!loadedSet.has(i) && (
                      <div
                        className="skeleton-shimmer"
                        style={{
                          position: "absolute",
                          inset: 0,
                          zIndex: 1,
                        }}
                      />
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt=""
                      loading="eager"
                      decoding="async"
                      onLoad={() =>
                        setLoadedSet((prev) => {
                          const next = new Set(prev);
                          next.add(i);
                          return next;
                        })
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        position: "absolute",
                        inset: 0,
                        zIndex: 2,
                        opacity: loadedSet.has(i) ? 1 : 0,
                        transition: "opacity 0.4s ease",
                      }}
                    />
                  </>
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
            src={all[lightboxIdx].src}
            all={all}
            onClose={() => setLightboxIdx(null)}
            onNavigate={(idx) => setLightboxIdx(idx)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
