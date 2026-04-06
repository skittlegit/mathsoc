"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
export interface TeamMember {
  name: string;
  role: string;
  img: string;
}

export interface TeamSection {
  label: string;
  members: TeamMember[];
}

export interface YearData {
  year: string;
  sections: TeamSection[];
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─────────── Helper ─────────── */
function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
}

/* ─────────── Photo Card ─────────── */
function MemberPhoto({
  src,
  alt,
  init,
}: {
  src: string;
  alt: string;
  init: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: "linear-gradient(175deg, #000510 0%, #000a25 100%)" }}
    >
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <span
          className="absolute inset-0 flex items-center justify-center font-bold select-none"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "rgba(255,255,255,0.06)",
          }}
        >
          {init}
        </span>
      )}
    </div>
  );
}

function BigCard({ member, year }: { member: TeamMember; year: string }) {
  const init = getInitials(member.name);
  const src = `/team/${year}/${member.img}`;
  return (
    <div className="group relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
      <MemberPhoto src={src} alt={member.name} init={init} />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.12) 55%, transparent 100%)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-semibold" style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.88)", lineHeight: 1.25 }}>
          {member.name}
        </p>
        {member.role && (
          <p style={{ fontSize: "0.48rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginTop: "4px" }}>
            {member.role}
          </p>
        )}
      </div>
    </div>
  );
}

function SmallCard({ member, year }: { member: TeamMember; year: string }) {
  const init = getInitials(member.name);
  const src = `/team/${year}/${member.img}`;
  return (
    <div className="group relative overflow-hidden" style={{ aspectRatio: "2/3" }}>
      <MemberPhoto src={src} alt={member.name} init={init} />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="font-semibold" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.25 }}>
          {member.name}
        </p>
        {member.role && (
          <p style={{ fontSize: "0.42rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: "3px" }}>
            {member.role}
          </p>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease }}
      className="flex items-center gap-4 mb-10"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "2.5rem" }}
    >
      <span style={{ fontSize: "0.48rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
    </motion.div>
  );
}

/* ─────────── Section renderer ─────────── */
function YearSection({ data, year }: { data: YearData; year: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={year}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.45, ease }}
      >
        {data.sections.map((section) => {
          const isLarge = section.members.length <= 7;
          return (
            <div key={section.label} className="mb-16">
              <SectionLabel label={section.label} />
              <div
                className={
                  isLarge
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                    : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
                }
              >
                {section.members.map((m) =>
                  isLarge ? (
                    <BigCard key={m.name} member={m} year={year} />
                  ) : (
                    <SmallCard key={m.name} member={m} year={year} />
                  )
                )}
              </div>
            </div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────── Main Component ─────────── */
export default function TeamClient({
  years,
  dataByYear,
}: {
  years: string[];
  dataByYear: Record<string, YearData>;
}) {
  const [activeYear, setActiveYear] = useState(years[0] ?? "2024");
  const currentData = dataByYear[activeYear];

  return (
    <div className="pt-32 md:pt-44 pb-24">
      <div className="px-7 md:px-14 max-w-7xl mx-auto">
        {/* Hero */}
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease }}
          style={{ fontSize: "0.56rem", letterSpacing: "0.4em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}
        >
          Mathematics Society · Mahindra University
        </motion.span>

        <motion.h1
          className="font-bold uppercase mt-6 mb-6"
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
          Team
        </motion.h1>

        <motion.p
          style={{
            fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.8,
            maxWidth: "520px",
            marginBottom: "3rem",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          The people who make MathSoc what it is — mathematicians, engineers,
          designers, thinkers. Driven by curiosity. United by a love for
          problem-solving.
        </motion.p>

        {/* Year Selector */}
        <motion.div
          className="flex items-center gap-2 flex-wrap mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span style={{ fontSize: "0.48rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", lineHeight: "32px" }}>
            Batch:
          </span>
          {years.map((yr) => (
            <button
              key={yr}
              onClick={() => setActiveYear(yr)}
              className="cursor-pointer bg-transparent transition-all duration-300"
              style={{
                fontSize: "0.72rem",
                fontWeight: activeYear === yr ? 700 : 400,
                letterSpacing: "0.1em",
                padding: "6px 18px",
                color: activeYear === yr ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.3)",
                border: activeYear === yr ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.07)",
                borderRadius: "2px",
              }}
            >
              {yr}
            </button>
          ))}
        </motion.div>

        {/* Team grid */}
        {currentData && <YearSection data={currentData} year={activeYear} />}
      </div>
    </div>
  );
}
