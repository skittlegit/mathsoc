"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-32 md:pt-44 pb-24">
      {/* Page Hero */}
      <div className="px-7 md:px-14 max-w-6xl mx-auto mb-20">
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
          Get in Touch
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
          Contact
        </motion.h1>
      </div>

      <div className="px-7 md:px-14 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-20">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease }}
          >
            <p
              className="mb-12 max-w-xl"
              style={{
                fontSize: "clamp(1rem, 1.7vw, 1.15rem)",
                lineHeight: 2,
                color: "rgba(255,255,255,0.42)",
              }}
            >
              We&apos;d love to hear from you — whether it&apos;s a question
              about membership, a collaboration idea, or you just want to argue
              about the Riemann Hypothesis.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="py-16 text-center"
              >
                <p
                  className="font-semibold mb-3"
                  style={{
                    fontSize: "1.2rem",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  Message sent!
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "rgba(255,255,255,0.25)",
                  }}
                >
                  We&apos;ll get back to you soon.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div>
                  <label
                    style={{
                      fontSize: "0.52rem",
                      letterSpacing: "0.3em",
                      color: "rgba(255,255,255,0.15)",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-transparent outline-none transition-colors"
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      padding: "12px 0",
                      fontSize: "1rem",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "0.52rem",
                      letterSpacing: "0.3em",
                      color: "rgba(255,255,255,0.15)",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-transparent outline-none transition-colors"
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      padding: "12px 0",
                      fontSize: "1rem",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "0.52rem",
                      letterSpacing: "0.3em",
                      color: "rgba(255,255,255,0.15)",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-transparent outline-none transition-colors resize-none"
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      padding: "12px 0",
                      fontSize: "1rem",
                      color: "rgba(255,255,255,0.6)",
                      lineHeight: 1.8,
                    }}
                  />
                </div>

                <motion.button
                  type="submit"
                  className="cursor-pointer bg-transparent border-none font-semibold"
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.6)",
                    borderBottom: "1px solid rgba(255,255,255,0.2)",
                    paddingBottom: "6px",
                  }}
                  whileHover={{ color: "rgba(255,255,255,1)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Send It →
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Sidebar info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease }}
            className="space-y-12"
          >
            <div>
              <p
                className="mb-3 font-semibold"
                style={{
                  fontSize: "0.5rem",
                  letterSpacing: "0.3em",
                  color: "rgba(255,255,255,0.1)",
                  textTransform: "uppercase",
                }}
              >
                Email
              </p>
              <a
                href="mailto:mathsoc@university.edu"
                className="link-underline hover:text-white transition-colors duration-300"
                style={{
                  fontSize: "0.95rem",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                mathsoc@university.edu
              </a>
            </div>

            <div>
              <p
                className="mb-3 font-semibold"
                style={{
                  fontSize: "0.5rem",
                  letterSpacing: "0.3em",
                  color: "rgba(255,255,255,0.1)",
                  textTransform: "uppercase",
                }}
              >
                Location
              </p>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "rgba(255,255,255,0.25)",
                  lineHeight: 1.8,
                }}
              >
                Room 314, Mathematics Building
                <br />
                University Campus
              </p>
            </div>

            <div>
              <p
                className="mb-3 font-semibold"
                style={{
                  fontSize: "0.5rem",
                  letterSpacing: "0.3em",
                  color: "rgba(255,255,255,0.1)",
                  textTransform: "uppercase",
                }}
              >
                Meetings
              </p>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "rgba(255,255,255,0.25)",
                  lineHeight: 1.8,
                }}
              >
                Every Wednesday, 5:00 PM
                <br />
                Open to all students
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
