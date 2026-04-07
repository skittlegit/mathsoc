import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "MathSoc — Mathematics Society",
  description:
    "The official Mathematics Society. Where curiosity becomes proof and problems become art.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full grain">
        {/* Fixed ambient background — multi-layer depth */}
        <div className="pointer-events-none fixed inset-0 z-0" style={{ background: "#000" }}>
          {/* Bottom-right: deep blue glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 65% 75% at 100% 100%, #001358 0%, #000922 22%, transparent 58%)",
            }}
          />
          {/* Top-left: subtle dark indigo breath */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 55% 50% at 0% 0%, rgba(12,4,32,0.9) 0%, transparent 60%)",
            }}
          />
          {/* Center-bottom: faint atmospheric warmth */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 90% 50% at 50% 100%, rgba(0,6,26,0.55) 0%, transparent 65%)",
            }}
          />
        </div>
        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
