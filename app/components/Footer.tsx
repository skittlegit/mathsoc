"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const SITE_LINKS = [
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Team", href: "/team" },
  { label: "Blackjack", href: "/blackjack" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/mathsoc.mu/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/mathematics-club-mu/" },
  { label: "WhatsApp", href: "https://chat.whatsapp.com/BLmgzpyLnvs3iXC8LYHxun" },
  { label: "Discord", href: "https://discord.gg/XAZKKrBQCC" },
];

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [email, setEmail] = useState("");

  return (
    <footer
      ref={ref}
      className="relative z-10 pt-20 pb-12"
      style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div className="max-w-6xl mx-auto px-7 md:px-14">
        {/* CTA Banner */}
        <motion.div
          className="mb-16 py-8"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p
            className="font-bold uppercase"
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            JOIN US. DISCOVER MATHEMATICS.
          </p>
        </motion.div>

        {/* Subscribe */}
        <motion.div
          className="mb-16 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <span
            style={{
              fontSize: "0.56rem",
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
            }}
          >
            Subscribe
          </span>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2 items-end"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-transparent px-0 py-2 text-sm outline-none transition-colors w-60"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
              }}
            />
            <button
              type="submit"
              className="cursor-pointer bg-transparent border-none transition-colors"
              style={{
                fontSize: "0.82rem",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              →
            </button>
          </form>
        </motion.div>

        {/* Link Columns */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-16 mb-20">
          <div className="flex gap-16 md:gap-20">
            <div>
              <p
                className="mb-4 font-semibold"
                style={{
                  fontSize: "0.5rem",
                  letterSpacing: "0.3em",
                  color: "rgba(255,255,255,0.1)",
                  textTransform: "uppercase",
                }}
              >
                Site Stuff
              </p>
              <ul className="space-y-2.5">
                {SITE_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="link-underline hover:text-white transition-colors duration-300"
                      style={{
                        fontSize: "0.82rem",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p
                className="mb-4 font-semibold"
                style={{
                  fontSize: "0.5rem",
                  letterSpacing: "0.3em",
                  color: "rgba(255,255,255,0.1)",
                  textTransform: "uppercase",
                }}
              >
                Social
              </p>
              <ul className="space-y-2.5">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline hover:text-white transition-colors duration-300"
                      style={{
                        fontSize: "0.82rem",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-7"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 relative">
              <Image
                src="/mathsoclogowhite.png"
                alt="MathSoc"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <span
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.25em",
                color: "rgba(255,255,255,0.15)",
                textTransform: "uppercase",
              }}
            >
              Mahindra University
            </span>
          </div>
          <p
            style={{
              fontSize: "0.52rem",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.07)",
              textTransform: "uppercase",
            }}
          >
            © 2025 MathSoc, Mahindra University. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
