"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Announcement } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const ANN_CACHE_KEY = "mathsoc_announcements_cache";
const ANN_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface AnnouncementsContextValue {
  announcements: Announcement[];
  loading: boolean;
}

const AnnouncementsContext = createContext<AnnouncementsContextValue>({
  announcements: [],
  loading: true,
});

function readAnnCache(): Announcement[] | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(ANN_CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > ANN_CACHE_TTL) return null;
    return data as Announcement[];
  } catch {
    return null;
  }
}

function writeAnnCache(data: Announcement[]) {
  try {
    localStorage.setItem(ANN_CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch { /* quota exceeded — ignore */ }
}

function getInitialAnnState(): { announcements: Announcement[]; hasCache: boolean } {
  const cached = readAnnCache();
  return cached ? { announcements: cached, hasCache: true } : { announcements: [], hasCache: false };
}

export function AnnouncementsProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(getInitialAnnState);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initial.announcements);
  const [loading, setLoading] = useState(!initial.hasCache);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "announcements"));
        const data: Announcement[] = snap.docs
          .map((d) => ({ ...d.data(), id: d.id } as unknown as Announcement))
          .filter((a) => a.active)
          .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
        setAnnouncements(data);
        writeAnnCache(data);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AnnouncementsContext.Provider value={{ announcements, loading }}>
      {children}
    </AnnouncementsContext.Provider>
  );
}

export function useAnnouncements() {
  return useContext(AnnouncementsContext);
}
