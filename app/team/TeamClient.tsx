"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/* ─── Types ─── */
export interface TeamMember {
  name: string;
  role: string;
  img: string;
  email?: string;
  instagram?: string;
  linkedin?: string;
}

export interface TeamSection {
  label: string;
  members: TeamMember[];
}

export interface YearData {
  year: string;
  sections: TeamSection[];
}

/* ─── Utils ─── */
function getImgSrc(img: string, year: string) {
  if (img.startsWith("/")) return img;
  return `/team/${year}/${img}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* ─── Social icons (inline SVG, 14×14) ─── */
function IconEmail() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m2 7 10 7 10-7"/>
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

/* ─── Social icon button ─── */
function SocialIcon({
  href,
  isExternal = true,
  children,
  label,
}: {
  href: string;
  isExternal?: boolean;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={(e) => e.stopPropagation()}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 26,
        height: 26,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.38)",
        borderRadius: 4,
        transition: "background 0.15s, color 0.15s, border-color 0.15s",
        flexShrink: 0,
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = "rgba(255,255,255,0.12)";
        el.style.color = "rgba(255,255,255,0.85)";
        el.style.borderColor = "rgba(255,255,255,0.18)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = "rgba(255,255,255,0.06)";
        el.style.color = "rgba(255,255,255,0.38)";
        el.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      {children}
    </a>
  );
}

/* ─── Photo with initials fallback ─── */
function MemberPhoto({ src, alt, init }: { src: string; alt: string; init: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.03)",
          color: "rgba(255,255,255,0.3)",
          fontSize: "1.4rem",
          fontWeight: 600,
          letterSpacing: "0.04em",
          userSelect: "none",
        }}
      >
        {init}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center top",
        display: "block",
      }}
    />
  );
}

/* ─── Member card ─── */
function MemberCard({ member, year }: { member: TeamMember; year: string }) {
  const init = getInitials(member.name);
  const src = getImgSrc(member.img, year);
  const hasSocials = !!(member.email || member.instagram || member.linkedin);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#060a14",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Photo */}
      <div
        style={{
          position: "relative",
          aspectRatio: "4/5",
          background: "#03050d",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <MemberPhoto src={src} alt={member.name} init={init} />
      </div>

      {/* Info strip */}
      <div
        style={{
          padding: "12px 14px 14px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          flex: 1,
        }}
      >
        <p
          style={{
            fontSize: "0.82rem",
            fontWeight: 600,
            color: "rgba(255,255,255,0.88)",
            lineHeight: 1.25,
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {member.name}
        </p>
        <p
          style={{
            fontSize: "0.42rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.28)",
            marginTop: 5,
            lineHeight: 1.4,
          }}
        >
          {member.role}
        </p>

        {hasSocials && (
          <div style={{ display: "flex", gap: 5, marginTop: 10, flexWrap: "wrap" }}>
            {member.email && (
              <SocialIcon
                href={`mailto:${member.email}`}
                isExternal={false}
                label={`Email ${member.name}`}
              >
                <IconEmail />
              </SocialIcon>
            )}
            {member.instagram && (
              <SocialIcon href={member.instagram} label={`${member.name} on Instagram`}>
                <IconInstagram />
              </SocialIcon>
            )}
            {member.linkedin && (
              <SocialIcon href={member.linkedin} label={`${member.name} on LinkedIn`}>
                <IconLinkedIn />
              </SocialIcon>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Animated section heading ─── */
function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
      <div style={{ height: 1, width: 28, background: "rgba(255,255,255,0.12)" }} />
      <span
        style={{
          fontSize: "0.44rem",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.28)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── Year section ─── */
function YearSection({ year, data }: { year: string; data: YearData }) {
  return (
    <div>
      {data.sections.map((section, si) => (
        <div key={si} style={{ marginBottom: 52 }}>
          <SectionLabel label={section.label} />
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
            style={{ gap: 12 }}
          >
            {section.members.map((member, mi) => (
              <motion.div
                key={mi}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: mi * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <MemberCard member={member} year={year} />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main client component ─── */
export default function TeamClient({
  years,
  dataByYear,
}: {
  years: string[];
  dataByYear: Record<string, YearData>;
}) {
  const [activeYear, setActiveYear] = useState(years[0] ?? "");

  return (
    <div style={{ paddingTop: 72, minHeight: "100vh" }}>
      <div className="px-7 md:px-14 max-w-6xl mx-auto" style={{ paddingTop: 48, paddingBottom: 20 }}>
        {/* Header */}
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "block",
            fontSize: "0.56rem",
            letterSpacing: "0.4em",
            color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          The People
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-bold uppercase"
          style={{
            fontSize: "clamp(3.5rem, 11vw, 9rem)",
            letterSpacing: "0.15em",
            lineHeight: 0.9,
            color: "rgba(255,255,255,0.88)",
            marginBottom: 16,
          }}
        >
          Our Team
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          style={{
            fontSize: "0.55rem",
            color: "rgba(255,255,255,0.22)",
            letterSpacing: "0.08em",
            maxWidth: 480,
          }}
        >
          The students who keep MathSoc running — organizers, designers, thinkers, and problem-solvers.
        </motion.p>

        {/* Year tabs */}
        {years.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            style={{ display: "flex", gap: 8, marginTop: 32 }}
          >
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                style={{
                  padding: "6px 16px",
                  fontSize: "0.55rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  border: "1px solid",
                  borderColor:
                    activeYear === year
                      ? "rgba(255,255,255,0.25)"
                      : "rgba(255,255,255,0.08)",
                  background:
                    activeYear === year
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",
                  color:
                    activeYear === year
                      ? "rgba(255,255,255,0.82)"
                      : "rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {year}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Team grid */}
      <div className="px-7 md:px-14 max-w-6xl mx-auto" style={{ paddingBottom: 80 }}>
        {activeYear && dataByYear[activeYear] && (
          <YearSection year={activeYear} data={dataByYear[activeYear]} />
        )}
      </div>
    </div>
  );
}
