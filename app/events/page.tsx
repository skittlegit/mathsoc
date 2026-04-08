"use client";
export const dynamic = "force-dynamic";

import { useEvents } from "@/lib/EventsContext";
import EventsClient, { EventsSkeleton } from "./EventsClient";

export default function EventsPage() {
  const { events, loading } = useEvents();

  if (loading) return <EventsSkeleton />;
  return <EventsClient events={events} />;
}
