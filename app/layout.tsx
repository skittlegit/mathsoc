import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: "#000922",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "MathSoc — Mathematics Society",
  description:
    "The official Mathematics Society. Where curiosity becomes proof and problems become art.",
  icons: {
    icon: [
      { url: "/favicon.ico/favicon.ico", sizes: "any" },
      { url: "/favicon.ico/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/favicon.ico/apple-icon-57x57.png", sizes: "57x57" },
      { url: "/favicon.ico/apple-icon-60x60.png", sizes: "60x60" },
      { url: "/favicon.ico/apple-icon-72x72.png", sizes: "72x72" },
      { url: "/favicon.ico/apple-icon-76x76.png", sizes: "76x76" },
      { url: "/favicon.ico/apple-icon-114x114.png", sizes: "114x114" },
      { url: "/favicon.ico/apple-icon-120x120.png", sizes: "120x120" },
      { url: "/favicon.ico/apple-icon-144x144.png", sizes: "144x144" },
      { url: "/favicon.ico/apple-icon-152x152.png", sizes: "152x152" },
      { url: "/favicon.ico/apple-icon-180x180.png", sizes: "180x180" },
      { url: "/favicon.ico/apple-icon-precomposed.png" },
    ],
    other: [
      {
        rel: "android-chrome-icon",
        url: "/favicon.ico/android-icon-192x192.png",
        sizes: "192x192",
      },
    ],
  },
  manifest: "/favicon.ico/manifest.json",
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
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
