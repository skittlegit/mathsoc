"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import EventsClient, { EventsSkeleton } from "./EventsClient";
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

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[] | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const q = query(collection(db, "events"), orderBy("date", "desc"));
        const snap = await getDocs(q);
        const list: EventItem[] = [];
        snap.forEach((doc) =>
          list.push(toEventItem({ id: doc.id, ...doc.data() }))
        );
        setEvents(list);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      }
    }
    fetchEvents();
  }, []);

  if (events === null) return <EventsSkeleton />;
  return <EventsClient events={events} />;
}
