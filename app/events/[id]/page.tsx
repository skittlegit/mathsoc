"use client";
export const dynamic = "force-dynamic";

import { useParams } from "next/navigation";
import { useEvents } from "@/lib/EventsContext";
import EventDetailClient from "./EventDetailClient";

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
    </div>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  const slug = params?.id as string;
  const { events, loading } = useEvents();

  if (loading) return <DetailSkeleton />;

  const event = events.find((e) => e.slug === slug);

  if (!event) {
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
