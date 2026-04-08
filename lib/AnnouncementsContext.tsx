"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Announcement } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface AnnouncementsContextValue {
  announcements: Announcement[];
  loading: boolean;
}

const AnnouncementsContext = createContext<AnnouncementsContextValue>({
  announcements: [],
  loading: true,
});

export function AnnouncementsProvider({ children }: { children: ReactNode }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "announcements"));
        const data: Announcement[] = snap.docs
          .map((d) => ({ ...d.data(), id: d.id } as unknown as Announcement))
          .filter((a) => a.active)
          .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
        setAnnouncements(data);
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
