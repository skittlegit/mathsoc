"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { EventItem } from "@/lib/types";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FILTERS = ["All", "Competition", "Academic", "Orientation", "Community Service"];

/* ── Reusable meta row — date · location · link · tag ── */
function MetaRow({ ev, size = "sm" }: { ev: EventItem; size?: "sm" | "lg" }) {
  const isLg = size === "lg";
  return (
    <div className="flex items-center gap-2 flex-wrap" style={{ gap: isLg ? 10 : 6 }}>
      <span style={{ fontSize: isLg ? "0.7rem" : "0.62rem", fontWeight: 600, color: "var(--c-text-muted)" }}>
        {ev.date}
      </span>
      {ev.location && (
        <>
          <span className="sep-dot" />
          <span className="meta-mono" style={{ fontSize: isLg ? "0.6rem" : "0.52rem" }}>
            {ev.location}
          </span>
        </>
      )}
      {ev.link && (
        <>
          <span className="sep-dot" />
          <span
            className="meta-mono"
            style={{
              fontSize: isLg ? "0.6rem" : "0.52rem",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
              textDecorationColor: "rgba(255,255,255,0.15)",
            }}
          >
            {ev.link.replace(/^https?:\/\//, "")}
          </span>
        </>
      )}
      <span className="tag-badge">{ev.tag}</span>
      {ev.author && (
        <>
          <span className="sep-dot" />
          <span className="meta-mono" style={{ fontSize: isLg ? "0.56rem" : "0.48rem", fontStyle: "italic" }}>
            by {ev.author}
          </span>
        </>
      )}
    </div>
  );
}

/* ── Event cover image ── */
function EventImage({
  ev,
  ratio = "3/2",
  eager = false,
}: {
  ev: EventItem;
  ratio?: string;
  eager?: boolean;
}) {
  if (!ev.photo) return null;
  return (
    <div className="ev-img-wrap" style={{ aspectRatio: ratio }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ev.photo}
        alt={ev.full}
        loading={eager ? "eager" : "lazy"}
        style={{
          objectPosition: ev.photoPosition || "center",
          transform: `scale(${ev.photoScale || 1})`,
          transformOrigin: ev.photoPosition || "center",
        }}
        className="group-hover:scale-[1.03]"
      />
    </div>
  );
}

/* ── Featured card — big hero image ── */
function FeaturedCard({ ev }: { ev: EventItem }) {
  return (
    <Link href={`/events/${ev.slug}`} className="block group">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <EventImage ev={ev} ratio="16/9" eager />

        <div style={{ marginTop: 20 }}>
          <div className="mb-3">
            <MetaRow ev={ev} size="lg" />
          </div>

          <h2
            className="font-bold group-hover:text-white transition-colors duration-300"
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              letterSpacing: "-0.01em",
              lineHeight: 1.05,
              color: "var(--c-text-2)",
              marginBottom: 12,
            }}
          >
            {ev.full}
          </h2>

          <p className="ev-card-desc">
            {ev.desc && ev.desc.length > 200 ? ev.desc.slice(0, 200).trim() + "…" : ev.desc}
          </p>
        </div>
      </motion.article>
    </Link>
  );
}

/* ── Compact event card ── */
function EventCard({ ev, index }: { ev: EventItem; index: number }) {
  return (
    <Link href={`/events/${ev.slug}`} className="block group">
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3), ease: EASE }}
      >
        {ev.photo ? (
          <div style={{ marginBottom: 14 }}>
            <EventImage ev={ev} />
          </div>
        ) : (
          <div style={{ borderTop: "1px solid var(--c-border)", paddingTop: 14, marginBottom: 14 }} />
        )}

        <div className="mb-2">
          <MetaRow ev={ev} />
        </div>

        <h3
          className="font-semibold group-hover:text-white transition-colors duration-300"
          style={{ fontSize: "1.05rem", color: "var(--c-text-2)", lineHeight: 1.2, marginBottom: 6 }}
        >
          {ev.full}
        </h3>

        <p className="ev-card-desc" style={{ fontSize: "0.8rem" }}>
          {ev.desc && ev.desc.length > 120 ? ev.desc.slice(0, 120).trim() + "…" : ev.desc}
        </p>
      </motion.article>
    </Link>
  );
}

/* ── Skeleton placeholders ── */
function SkeletonBlock({ w, h, mb = 0, ratio }: { w?: string | number; h?: number; mb?: number; ratio?: string }) {
  return (
    <div
      className="skeleton-pulse skel"
      style={{ width: w ?? "100%", height: ratio ? undefined : h, aspectRatio: ratio, marginBottom: mb }}
    />
  );
}

function SkeletonFeatured() {
  return (
    <div style={{ marginBottom: 56 }}>
      <SkeletonBlock ratio="16/9" mb={20} />
      <SkeletonBlock w={180} h={10} mb={14} />
      <SkeletonBlock w="60%" h={28} mb={10} />
      <SkeletonBlock w="80%" h={12} />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div>
      <SkeletonBlock ratio="3/2" mb={14} />
      <SkeletonBlock w={120} h={8} mb={10} />
      <SkeletonBlock w="75%" h={14} mb={8} />
      <SkeletonBlock w="90%" h={10} />
    </div>
  );
}

export function EventsSkeleton() {
  return (
    <div className="pt-32 md:pt-44 pb-24">
      <div className="page-container mb-16">
        <SkeletonBlock w={200} h={8} mb={24} />
        <SkeletonBlock w="50%" h={64} />
      </div>
      <div className="page-container">
        <SkeletonFeatured />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 32 }}>
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function EventsClient({ events }: { events: EventItem[] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All" ? events : events.filter((e) => e.tag === activeFilter);
  const years = [...new Set(filtered.map((e) => e.year))].sort((a, b) => b - a);

  return (
    <div className="pt-32 md:pt-44 pb-24">
      {/* Header */}
      <div className="page-container mb-16">
        <motion.span
          className="eyebrow block"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          Competitions, Workshops &amp; More
        </motion.span>

        <motion.h1
          className="font-bold uppercase mt-6"
          style={{ fontSize: "clamp(3.5rem, 11vw, 9rem)", letterSpacing: "0.15em", color: "var(--c-text)", lineHeight: 0.9 }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: EASE }}
        >
          Events
        </motion.h1>
      </div>

      {/* Filters */}
      <div className="page-container mb-10">
        <motion.div
          className="flex flex-wrap items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="eyebrow" style={{ fontSize: "0.5rem", letterSpacing: "0.22em", lineHeight: "28px" }}>
            Filter:
          </span>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="filter-chip"
              data-active={activeFilter === f}
            >
              {f}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Event grid by year */}
      <div className="page-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filtered.length === 0 && (
              <p style={{ color: "var(--c-text-muted)", fontSize: "0.9rem", paddingTop: 40 }}>
                No events found.
              </p>
            )}

            {years.map((year) => {
              const yearEvents = filtered.filter((e) => e.year === year).sort((a, b) => b.date.localeCompare(a.date));
              if (yearEvents.length === 0) return null;
              const [featured, ...rest] = yearEvents;

              return (
                <div key={year} style={{ marginBottom: 72 }}>
                  <div style={{ borderTop: "1px solid var(--c-border-subtle)", paddingTop: 16, marginBottom: 32 }}>
                    <span
                      className="font-bold"
                      style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", lineHeight: 1 }}
                    >
                      {year}
                    </span>
                  </div>

                  <div style={{ marginBottom: rest.length > 0 ? 40 : 0 }}>
                    <FeaturedCard ev={featured} />
                  </div>

                  {rest.length > 0 && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: 32,
                        marginTop: 8,
                      }}
                    >
                      {rest.map((ev, i) => <EventCard key={ev.id} ev={ev} index={i} />)}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
