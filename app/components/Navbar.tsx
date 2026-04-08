"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import MenuOverlay from "./MenuOverlay";

const NAV_LINKS = [
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Team", href: "/team" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <motion.nav
        className="fixed top-4 left-4 right-4 md:left-8 md:right-8 z-50 px-5 md:px-8"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease }}
        style={{
          borderRadius: 14,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >

        <div className="flex items-center justify-between h-[72px]">
        {/* Left: Logo + name */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 relative shrink-0">
            <Image
              src="/mathsoclogowhite.png"
              alt="MathSoc"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <span
            className="text-white font-semibold hidden sm:block"
            style={{
              fontSize: "0.82rem",
              letterSpacing: "0.05em",
            }}
          >
            MathSoc
          </span>
        </Link>

        {/* Right: Page links + Menu */}
        <div className="flex items-center gap-7">
          {NAV_LINKS.map((link, i) => (
            <motion.div
              key={link.label}
              className="hidden md:block"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.6 }}
            >
              <Link
                href={link.href}
                className="link-underline hover:text-white transition-colors duration-300"
                style={{
                  fontSize: "0.58rem",
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.6)",
                  textTransform: "uppercase",
                }}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
          <button
            onClick={() => setMenuOpen(true)}
            className="cursor-pointer bg-transparent border-none flex flex-col items-end justify-center hover:opacity-60 transition-opacity duration-300"
            style={{ width: 32, height: 32, gap: "5px", padding: "5px 0" }}
            aria-label="Open menu"
          >
            <span style={{ display: "block", width: 22, height: 1.5, background: "rgba(255,255,255,0.75)", borderRadius: 2 }} />
            <span style={{ display: "block", width: 14, height: 1.5, background: "rgba(255,255,255,0.75)", borderRadius: 2 }} />
            <span style={{ display: "block", width: 22, height: 1.5, background: "rgba(255,255,255,0.75)", borderRadius: 2 }} />
          </button>
        </div>
        </div>
      </motion.nav>

      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
