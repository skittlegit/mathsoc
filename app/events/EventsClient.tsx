"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { EventItem } from "./page";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FILTERS = ["All", "Competition", "Academic", "Orientation"];

function EventRow({ ev, index }: { ev: EventItem; index: number }) {
  return (
    <Link href={`/events/${ev.id}`} className="block">
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease }}
      whileHover={{ x: 8, backgroundColor: "rgba(255,255,255,0.012)" }}
      className="group flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 py-8 cursor-pointer"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div className="shrink-0 w-36">
        <p
          className="font-semibold mb-1"
          style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)" }}
        >
          {ev.date}
        </p>
        <p
          style={{
            fontSize: "0.62rem",
            color: "rgba(255,255,255,0.38)",
            letterSpacing: "0.1em",
            fontFamily: "var(--font-jetbrains-mono)",
          }}
        >
          {ev.location}
        </p>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h3
            className="font-semibold group-hover:text-white transition-colors duration-300"
            style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.82)",
              letterSpacing: "-0.01em",
            }}
          >
            {ev.full}
          </h3>
          <span
            style={{
              fontSize: "0.48rem",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.35)",
              border: "1px solid rgba(255,255,255,0.12)",
              padding: "2px 8px",
              textTransform: "uppercase",
            }}
          >
            {ev.tag}
          </span>
        </div>
        <p
          style={{
            fontSize: "0.88rem",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.75,
          }}
        >
          {ev.desc}
        </p>
      </div>

      {ev.photo && (
        <div className="shrink-0 hidden sm:block" style={{ width: 72, height: 54, overflow: "hidden", flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ev.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8h10M8 3l5 5-5 5"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </motion.div>
    </Link>
  );
}

export default function EventsClient({ events }: { events: EventItem[] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? events
      : events.filter((e) => e.tag === activeFilter);

  const years = [...new Set(events.map((e) => e.year))].sort((a, b) => b - a);

  return (
    <div className="pt-32 md:pt-44 pb-24">
      <div className="px-7 md:px-14 max-w-6xl mx-auto mb-16">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease }}
          style={{
            fontSize: "0.56rem",
            letterSpacing: "0.4em",
            color: "rgba(255,255,255,0.2)",
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
              color: "rgba(255,255,255,0.12)",
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
                    : "rgba(255,255,255,0.2)",
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

      <div className="px-7 md:px-14 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {years.map((year) => {
              const yearEvents = filtered.filter((e) => e.year === year);
              if (yearEvents.length === 0) return null;
              return (
                <div key={year} className="mb-16">
                  <div
                    className="flex items-center gap-6 mb-4 pt-4"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <span
                      className="font-bold"
                      style={{
                        fontSize: "clamp(3rem, 8vw, 6rem)",
                        color: "rgba(255,255,255,0.03)",
                        letterSpacing: "0.1em",
                        lineHeight: 1,
                      }}
                    >
                      {year}
                    </span>
                  </div>
                  {yearEvents.map((ev, i) => (
                    <EventRow key={ev.id} ev={ev} index={i} />
                  ))}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
