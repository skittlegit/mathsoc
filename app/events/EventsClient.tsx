"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { EventItem } from "@/lib/types";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FILTERS = ["All", "Competition", "Academic", "Orientation"];

/* ── Featured card — big hero image ── */
function FeaturedCard({ ev }: { ev: EventItem }) {
  return (
    <Link href={`/events/${ev.slug}`} className="block group">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        {ev.photo && (
          <div
            style={{
              width: "100%",
              aspectRatio: "16/9",
              overflow: "hidden",
              background: "rgba(255,255,255,0.02)",
              borderRadius: 2,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ev.photo}
              alt={ev.full}
              loading="eager"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: ev.photoPosition || "center",
                transform: `scale(${ev.photoScale || 1})`,
                transformOrigin: ev.photoPosition || "center",
                display: "block",
                transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
              }}
              className="group-hover:scale-[1.03]"
            />
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {ev.date}
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
                fontSize: "0.6rem",
                color: "rgba(255,255,255,0.4)",
                fontFamily: "var(--font-jetbrains-mono)",
                letterSpacing: "0.08em",
              }}
            >
              {ev.location}
            </span>
            <span
              style={{
                fontSize: "0.44rem",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "2px 8px",
                textTransform: "uppercase",
              }}
            >
              {ev.tag}
            </span>
          </div>

          <h2
            className="font-bold group-hover:text-white transition-colors duration-300"
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              letterSpacing: "-0.01em",
              lineHeight: 1.05,
              color: "rgba(255,255,255,0.88)",
              marginBottom: 12,
            }}
          >
            {ev.full}
          </h2>

          <p
            style={{
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.62)",
              lineHeight: 1.7,
              maxWidth: 640,
            }}
          >
            {ev.desc && ev.desc.length > 180
              ? ev.desc.slice(0, 180).trim() + "…"
              : ev.desc}
          </p>
        </div>
      </motion.article>
    </Link>
  );
}

/* ── Compact event card with image ── */
function EventCard({ ev, index }: { ev: EventItem; index: number }) {
  return (
    <Link href={`/events/${ev.slug}`} className="block group">
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: Math.min(index * 0.05, 0.3),
          ease,
        }}
      >
        {ev.photo && (
          <div
            style={{
              width: "100%",
              aspectRatio: "3/2",
              overflow: "hidden",
              background: "rgba(255,255,255,0.02)",
              borderRadius: 2,
              marginBottom: 14,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ev.photo}
              alt={ev.full}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: ev.photoPosition || "center",
                transform: `scale(${ev.photoScale || 1})`,
                transformOrigin: ev.photoPosition || "center",
                display: "block",
                transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
              }}
              className="group-hover:scale-[1.03]"
            />
          </div>
        )}

        {!ev.photo && (
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: 14,
              marginBottom: 14,
            }}
          />
        )}

        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            style={{
              fontSize: "0.62rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {ev.date}
          </span>
          <span
            style={{
              width: 2,
              height: 2,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: "0.52rem",
              color: "rgba(255,255,255,0.55)",
              fontFamily: "var(--font-jetbrains-mono)",
              letterSpacing: "0.08em",
            }}
          >
            {ev.location}
          </span>
        </div>

        <h3
          className="font-semibold group-hover:text-white transition-colors duration-300"
          style={{
            fontSize: "1.05rem",
            color: "rgba(255,255,255,0.82)",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
            marginBottom: 6,
          }}
        >
          {ev.full}
        </h3>

        <p
          style={{
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.65,
          }}
        >
          {ev.desc && ev.desc.length > 120
            ? ev.desc.slice(0, 120).trim() + "…"
            : ev.desc}
        </p>
      </motion.article>
    </Link>
  );
}

/* ── Skeleton placeholders ── */
function SkeletonFeatured() {
  return (
    <div style={{ marginBottom: 56 }}>
      <div
        className="skeleton-pulse"
        style={{
          width: "100%",
          aspectRatio: "16/9",
          background: "rgba(255,255,255,0.03)",
          borderRadius: 2,
        }}
      />
      <div style={{ marginTop: 20 }}>
        <div
          className="skeleton-pulse"
          style={{
            width: 180,
            height: 10,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 2,
            marginBottom: 14,
          }}
        />
        <div
          className="skeleton-pulse"
          style={{
            width: "60%",
            height: 28,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 2,
            marginBottom: 10,
          }}
        />
        <div
          className="skeleton-pulse"
          style={{
            width: "80%",
            height: 12,
            background: "rgba(255,255,255,0.03)",
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div>
      <div
        className="skeleton-pulse"
        style={{
          width: "100%",
          aspectRatio: "3/2",
          background: "rgba(255,255,255,0.03)",
          borderRadius: 2,
          marginBottom: 14,
        }}
      />
      <div
        className="skeleton-pulse"
        style={{
          width: 120,
          height: 8,
          background: "rgba(255,255,255,0.04)",
          borderRadius: 2,
          marginBottom: 10,
        }}
      />
      <div
        className="skeleton-pulse"
        style={{
          width: "75%",
          height: 14,
          background: "rgba(255,255,255,0.04)",
          borderRadius: 2,
          marginBottom: 8,
        }}
      />
      <div
        className="skeleton-pulse"
        style={{
          width: "90%",
          height: 10,
          background: "rgba(255,255,255,0.03)",
          borderRadius: 2,
        }}
      />
    </div>
  );
}

export function EventsSkeleton() {
  return (
    <div className="pt-32 md:pt-44 pb-24">
      <div className="px-7 md:px-14 max-w-6xl mx-auto mb-16">
        <div
          className="skeleton-pulse"
          style={{
            width: 200,
            height: 8,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 2,
            marginBottom: 24,
          }}
        />
        <div
          className="skeleton-pulse"
          style={{
            width: "50%",
            height: 64,
            background: "rgba(255,255,255,0.03)",
            borderRadius: 2,
          }}
        />
      </div>
      <div className="px-7 md:px-14 max-w-6xl mx-auto">
        <SkeletonFeatured />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 32,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

/* ── Main ── */
export default function EventsClient({ events }: { events: EventItem[] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? events
      : events.filter((e) => e.tag === activeFilter);

  const years = [...new Set(filtered.map((e) => e.year))].sort(
    (a, b) => b - a
  );

  return (
    <div className="pt-32 md:pt-44 pb-24">
      {/* Header */}
      <div className="px-7 md:px-14 max-w-6xl mx-auto mb-16">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease }}
          style={{
            fontSize: "0.56rem",
            letterSpacing: "0.4em",
            color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase",
          }}
        >
          Competitions, Workshops & More
        </motion.span>

        <motion.h1
          className="font-bold uppercase mt-6"
          style={{
            fontSize: "clamp(3.5rem, 11vw, 9rem)",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.9)",
            lineHeight: 0.9,
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease }}
        >
          Events
        </motion.h1>
      </div>

      {/* Filters */}
      <div className="px-7 md:px-14 max-w-6xl mx-auto mb-10">
        <motion.div
          className="flex flex-wrap items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span
            style={{
              fontSize: "0.5rem",
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase",
              lineHeight: "28px",
            }}
          >
            Filter:
          </span>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="cursor-pointer bg-transparent transition-all duration-300"
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "5px 14px",
                color:
                  activeFilter === f
                    ? "rgba(255,255,255,0.8)"
                    : "rgba(255,255,255,0.5)",
                border:
                  activeFilter === f
                    ? "1px solid rgba(255,255,255,0.15)"
                    : "1px solid rgba(255,255,255,0.05)",
                borderRadius: "2px",
              }}
            >
              {f}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Event grid by year */}
      <div className="px-7 md:px-14 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filtered.length === 0 && (
              <p
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "0.9rem",
                  paddingTop: 40,
                }}
              >
                No events found.
              </p>
            )}

            {years.map((year) => {
              const yearEvents = filtered.filter((e) => e.year === year);
              if (yearEvents.length === 0) return null;

              const [featured, ...rest] = yearEvents;

              return (
                <div key={year} style={{ marginBottom: 72 }}>
                  {/* Year label */}
                  <div
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.04)",
                      paddingTop: 16,
                      marginBottom: 32,
                    }}
                  >
                    <span
                      className="font-bold"
                      style={{
                        fontSize: "clamp(2.5rem, 6vw, 5rem)",
                        color: "rgba(255,255,255,0.3)",
                        letterSpacing: "0.1em",
                        lineHeight: 1,
                      }}
                    >
                      {year}
                    </span>
                  </div>

                  {/* Featured event — full width */}
                  <div style={{ marginBottom: rest.length > 0 ? 40 : 0 }}>
                    <FeaturedCard ev={featured} />
                  </div>

                  {/* Remaining events in grid */}
                  {rest.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 32,
                        marginTop: 8,
                      }}
                    >
                      {rest.map((ev, i) => (
                        <div key={ev.id} style={{ flex: "1 1 280px", minWidth: 0 }}>
                          <EventCard ev={ev} index={i} />
                        </div>
                      ))}
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
