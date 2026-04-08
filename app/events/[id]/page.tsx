"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import EventDetailClient from "./EventDetailClient";
import type { EventItem } from "@/lib/types";

function toEventItem(doc: { id: string; [key: string]: unknown }): EventItem {
  const d = doc;
  const rawDate = d.date;
  let dateStr = "";
  let year = new Date().getFullYear();

  if (rawDate && typeof rawDate === "object" && "toDate" in rawDate) {
    const dt = (rawDate as { toDate: () => Date }).toDate();
    dateStr = dt
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase();
    year = dt.getFullYear();
  } else if (typeof rawDate === "string") {
    dateStr = rawDate;
    const parsed = new Date(rawDate);
    if (!isNaN(parsed.getTime())) year = parsed.getFullYear();
  }

  return {
    id: d.id as string,
    slug: (d.slug as string) || (d.id as string),
    year,
    date: dateStr,
    title: (d.title as string) || "",
    full: (d.title as string) || "",
    location: (d.location as string) || "",
    desc: (d.summary as string) || (d.content as string) || "",
    tag: (d.category as string) || "Event",
    photo: (d.mainImageUrl as string) || undefined,
    content: (d.content as string) || undefined,
    gallery: (d.additionalImageUrls as string[]) || undefined,
  };
}

function DetailSkeleton() {
  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100 }}>
      <div
        className="skeleton-pulse"
        style={{
          width: "100%",
          aspectRatio: "21/9",
          minHeight: 280,
          maxHeight: 520,
          background: "rgba(255,255,255,0.03)",
        }}
      />
      <div className="px-7 md:px-14 max-w-6xl mx-auto" style={{ marginTop: 32 }}>
        <div
          className="skeleton-pulse"
          style={{
            width: "70%",
            height: 48,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 2,
            marginBottom: 24,
          }}
        />
        <div className="flex gap-3 mb-12">
          <div
            className="skeleton-pulse"
            style={{
              width: 100,
              height: 12,
              background: "rgba(255,255,255,0.04)",
              borderRadius: 2,
            }}
          />
          <div
            className="skeleton-pulse"
            style={{
              width: 80,
              height: 12,
              background: "rgba(255,255,255,0.03)",
              borderRadius: 2,
            }}
          />
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 40,
            maxWidth: 680,
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton-pulse"
              style={{
                width: `${90 - i * 10}%`,
                height: 12,
                background: "rgba(255,255,255,0.03)",
                borderRadius: 2,
                marginBottom: 18,
              }}
            />
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

export default function EventDetailPage() {
  const params = useParams();
  const slug = params?.id as string;
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const q = query(
          collection(db, "events"),
          where("slug", "==", slug),
          limit(1)
        );
        const snap = await getDocs(q);
        if (snap.empty) {
          setNotFound(true);
          return;
        }
        const doc = snap.docs[0];
        setEvent(toEventItem({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching event:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchEvent();
  }, [slug]);

  if (loading) return <DetailSkeleton />;

  if (notFound || !event) {
    return (
      <div
        className="pt-32 md:pt-44 pb-24 flex flex-col items-center justify-center"
        style={{ minHeight: "60vh" }}
      >
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.2rem" }}>
          Event not found
        </p>
      </div>
    );
  }

  return <EventDetailClient event={event} />;
}
