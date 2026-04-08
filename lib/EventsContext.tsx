"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { EventItem } from "@/lib/types";

interface EventsContextValue {
  events: EventItem[];
  loading: boolean;
}

const EventsContext = createContext<EventsContextValue>({ events: [], loading: true });

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    (async () => {
      try {
        const q = query(collection(db, "events"), orderBy("date", "desc"));
        const snap = await getDocs(q);
        const list: EventItem[] = [];
        snap.forEach((d) => {
          const data = d.data();
          const rawDate = data.date;
          let dateStr = "";
          let year = new Date().getFullYear();
          if (rawDate && typeof rawDate === "object" && "toDate" in rawDate) {
            const dt = (rawDate as { toDate: () => Date }).toDate();
            dateStr = dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase();
            year = dt.getFullYear();
          } else if (typeof rawDate === "string") {
            dateStr = rawDate;
            const parsed = new Date(rawDate);
            if (!isNaN(parsed.getTime())) year = parsed.getFullYear();
          }
          list.push({
            id: d.id,
            slug: (data.slug as string) || d.id,
            year,
            date: dateStr,
            title: (data.title as string) || "",
            full: (data.title as string) || "",
            location: (data.location as string) || "",
            desc: (data.summary as string) || (data.content as string) || "",
            tag: (data.category as string) || "Event",
            photo: (data.mainImageUrl as string) || undefined,
            photoPosition: (data.photoPosition as string) || undefined,
            photoScale: (data.photoScale as number) || undefined,
            content: (data.content as string) || undefined,
            gallery: (data.additionalImageUrls as string[]) || undefined,
          });
        });
        setEvents(list);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <EventsContext.Provider value={{ events, loading }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventsContext);
}
