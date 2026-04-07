"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
const GAP = 6;

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
      ([e]) => { if (e.isIntersecting) el.play().catch(() => {}); else el.pause(); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <video
      ref={ref} src={src} muted loop playsInline preload="none"
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
    />
  );
}

/* ─── Single gallery item ─── */
function GalleryItem({
  src,
  isFirst,
  itemRef,
}: {
  src: string;
  isFirst?: boolean;
  itemRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const isVideo = /\.(mp4|webm|mov)$/i.test(decodeURIComponent(src));
  return (
    <div
      ref={isFirst ? itemRef : undefined}
      style={{
        width: "100%",
        aspectRatio: "2/3",
        overflow: "hidden",
        background: "#000510",
        flexShrink: 0,
        display: "block",
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
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
        />
      )}
    </div>
  );
}

/* ─── Main ─── */
export default function GalleryClient({
  images,
  videos,
}: {
  images: string[];
  videos: string[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLDivElement>(null);
  const copyHeightRef = useRef(0);
  const resetLockRef = useRef(false);

  const all = shuffle([...images, ...videos]);
  const n = all.length;

  // Three different offsets so columns look independent
  const r1 = Math.floor(n / 3);
  const r2 = Math.floor((n * 2) / 3);
  const col1 = all;
  const col2 = [...all.slice(r1), ...all.slice(0, r1)];
  const col3 = [...all.slice(r2), ...all.slice(0, r2)];

  // Triple each column — seamless loop via scroll reset
  const t1 = [...col1, ...col1, ...col1];
  const t2 = [...col2, ...col2, ...col2];
  const t3 = [...col3, ...col3, ...col3];

  useEffect(() => {
    const el = scrollRef.current;
    const fi = firstItemRef.current;
    if (!el || !fi) return;

    const measure = () => {
      const h = fi.getBoundingClientRect().height;
      if (h === 0) { requestAnimationFrame(measure); return; }
      // Each copy = n items + (n-1) gaps
      copyHeightRef.current = n * h + (n - 1) * GAP;
      el.scrollTop = copyHeightRef.current;
    };

    const onScroll = () => {
      if (resetLockRef.current) return;
      const cH = copyHeightRef.current;
      if (!cH) return;
      const st = el.scrollTop;
      if (st >= cH * 2) {
        resetLockRef.current = true;
        el.scrollTop = st - cH;
        requestAnimationFrame(() => { resetLockRef.current = false; });
      } else if (st < cH * 0.02) {
        resetLockRef.current = true;
        el.scrollTop = st + cH;
        requestAnimationFrame(() => { resetLockRef.current = false; });
      }
    };

    const onResize = () => {
      const h = fi.getBoundingClientRect().height;
      if (h === 0) return;
      copyHeightRef.current = n * h + (n - 1) * GAP;
      el.scrollTop = copyHeightRef.current;
    };

    requestAnimationFrame(measure);
    window.addEventListener("resize", onResize, { passive: true });
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      el.removeEventListener("scroll", onScroll);
    };
  }, [n]);

  return (
    <div style={{ height: "100svh", display: "flex", flexDirection: "column", paddingTop: 72 }}>
      {/* Header */}
      <div style={{ position: "relative", zIndex: 10, padding: "24px 28px 16px", flexShrink: 0 }}>
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
          {images.length} photos · {videos.length} videos · scroll to explore
        </motion.p>
      </div>

      {/* Scrollable columns — infinitely loop on user scroll */}
      <motion.div
        ref={scrollRef}
        className="gallery-scroll"
        style={{ flex: 1, overflowY: "scroll", scrollbarWidth: "none" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.7 }}
      >
        <div style={{ display: "flex", gap: GAP, padding: `0 ${GAP}px ${GAP}px` }}>
          {/* Column 1 — always visible */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: GAP }}>
            {t1.map((src, i) => (
              <GalleryItem
                key={i}
                src={src}
                isFirst={i === 0}
                itemRef={firstItemRef}
              />
            ))}
          </div>

          {/* Column 2 — always visible */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: GAP }}>
            {t2.map((src, i) => (
              <GalleryItem key={i} src={src} />
            ))}
          </div>

          {/* Column 3 — hidden on small mobile */}
          <div className="hidden sm:flex" style={{ flex: 1, flexDirection: "column", gap: GAP }}>
            {t3.map((src, i) => (
              <GalleryItem key={i} src={src} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Top fade overlay so header blends into columns */}
      <div
        style={{
          position: "fixed",
          top: 72,
          left: 0,
          right: 0,
          height: 120,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />
    </div>
  );
}
