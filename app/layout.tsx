import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { EventsProvider } from "@/lib/EventsContext";

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

export const viewport: Viewport = {
  themeColor: "#000000",
  viewportFit: "cover",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "MathSoc",
  description:
    "The official Mathematics Society. Where curiosity becomes proof and problems become art.",
  appleWebApp: {
    statusBarStyle: "black-translucent",
  },
};

/** Collect team image URLs for preloading */
function getTeamImageUrls(): string[] {
  const teamDir = join(process.cwd(), "public", "team");
  const urls: string[] = [];
  try {
    const years = readdirSync(teamDir).filter((f) => /^\d{4}$/.test(f));
    for (const year of years) {
      const dataFile = join(teamDir, year, "data.json");
      if (!existsSync(dataFile)) continue;
      const raw = JSON.parse(readFileSync(dataFile, "utf-8"));
      for (const section of raw.sections ?? []) {
        for (const m of section.members ?? []) {
          if (m.img && m.name?.trim() && !/\/$/.test(m.img.trim())) {
            urls.push(m.img);
          }
        }
      }
    }
  } catch { /* ignore */ }
  return urls;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const teamImages = getTeamImageUrls();

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {teamImages.map((src) => (
          <link key={src} rel="prefetch" href={src} as="image" />
        ))}
      </head>
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
          {/* Top-left: matching deep blue glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 35% 38% at 0% 0%, #001358 0%, #000922 20%, transparent 48%)",
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
        <EventsProvider>
          <main className="relative z-10">{children}</main>
        </EventsProvider>
        <Footer />
      </body>
    </html>
  );
}
