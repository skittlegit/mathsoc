"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { EventItem } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const CACHE_KEY = "mathsoc_events_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface EventsContextValue {
  events: EventItem[];
  loading: boolean;
}

const EventsContext = createContext<EventsContextValue>({ events: [], loading: true });

function readCache(): EventItem[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data as EventItem[];
  } catch {
    return null;
  }
}

function writeCache(data: EventItem[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch { /* quota exceeded — ignore */ }
}

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from cache immediately
    const cached = readCache();
    if (cached) {
      setEvents(cached);
      setLoading(false);
    }

    // Always fetch fresh data
    (async () => {
      try {
        const snap = await getDocs(collection(db, "events"));
        const data: EventItem[] = snap.docs
          .map((d) => {
            const docData = d.data();
            return { ...docData, id: d.id, slug: docData.slug || d.id } as unknown as EventItem;
          })
          .sort((a, b) => b.year - a.year || b.date.localeCompare(a.date));
        setEvents(data);
        writeCache(data);
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
