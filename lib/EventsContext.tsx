"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { EventItem } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

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
        const snap = await getDocs(collection(db, "events"));
        const data: EventItem[] = snap.docs
          .map((d) => {
            const docData = d.data();
            return { ...docData, id: d.id, slug: docData.slug || d.id } as EventItem;
          })
          .sort((a, b) => b.year - a.year || b.date.localeCompare(a.date));
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
