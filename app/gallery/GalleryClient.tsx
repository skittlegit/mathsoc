"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─── Shuffle deterministically ─── */
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

/* ─── Inline Video ─── */
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
      className="h-full w-auto max-w-none object-cover"
      style={{ pointerEvents: "none" }}
    />
  );
}

/* ─── Single Row ─── */
function GalleryRow({
  items,
  direction,
  speed,
  rowH,
}: {
  items: string[];
  direction: "left" | "right";
  speed: number; // seconds for one full scroll
  rowH: number;
}) {
  // Triple the items for seamless infinite loop
  const looped = [...items, ...items, ...items];

  return (
    <div
      className="overflow-hidden"
      style={{ height: rowH, display: "flex", alignItems: "center" }}
    >
      <motion.div
        className="flex shrink-0 gap-3"
        style={{ height: rowH - 8 }}
        animate={{
          x: direction === "left"
            ? [0, `-${(100 / 3).toFixed(4)}%`]
            : [`-${(100 / 3).toFixed(4)}%`, "0%"],
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {looped.map((src, i) => {
          const isVideo = /\.mp4$|\.webm$|\.mov$/i.test(src);
          return (
            <div
              key={i}
              className="shrink-0 overflow-hidden rounded-sm"
              style={{
                height: rowH - 8,
                width: rowH * 1.45,
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
                  className="h-full w-full object-cover"
                  style={{ pointerEvents: "none" }}
                />
              )}
            </div>
          );
        })}
      </motion.div>
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
  const all = shuffle([...images, ...videos]);
  const count = all.length;

  // Distribute across 3 rows
  const row1 = all.slice(0, Math.ceil(count / 3));
  const row2 = all.slice(Math.ceil(count / 3), Math.ceil((count * 2) / 3));
  const row3 = all.slice(Math.ceil((count * 2) / 3));

  // Ensure each row has enough items for seamless loop (min 6)
  const pad = (arr: string[], min = 6) => {
    while (arr.length < min) arr = [...arr, ...arr];
    return arr;
  };

  return (
    <div className="pt-32 md:pt-44 pb-0">
      {/* Header */}
      <div className="px-7 md:px-14 max-w-6xl mx-auto mb-12">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease }}
          style={{
            fontSize: "0.56rem",
            letterSpacing: "0.4em",
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
          }}
        >
          Photos & Videos
        </motion.span>

        <motion.h1
          className="font-bold uppercase mt-6"
          style={{
            fontSize: "clamp(3.5rem, 11vw, 9rem)",
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.92)",
            lineHeight: 0.9,
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease }}
        >
          Gallery
        </motion.h1>

        <motion.p
          style={{
            fontSize: "clamp(0.88rem, 1.6vw, 1rem)",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.8,
            maxWidth: "480px",
            marginTop: "1.5rem",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          {images.length} photos · {videos.length} videos · moments from every event
        </motion.p>
      </div>

      {/* Endless strip rows */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="flex flex-col gap-3 pb-24"
      >
        {row1.length > 0 && (
          <GalleryRow items={pad(row1)} direction="left" speed={60} rowH={240} />
        )}
        {row2.length > 0 && (
          <GalleryRow items={pad(row2)} direction="right" speed={80} rowH={200} />
        )}
        {row3.length > 0 && (
          <GalleryRow items={pad(row3)} direction="left" speed={70} rowH={220} />
        )}
      </motion.div>
    </div>
  );
}
