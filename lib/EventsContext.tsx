"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
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
    (async () => {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        const raw: (EventItem & { slug?: string })[] = await res.json();
        // Ensure slug exists (fall back to id for legacy entries without slug)
        const data: EventItem[] = raw.map((e) => ({ ...e, slug: e.slug || e.id }));
        setEvents(data);
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
