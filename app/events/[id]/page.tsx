import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import EventDetailClient from "./EventDetailClient";
import type { EventItem } from "../page";

async function getEvent(id: string): Promise<EventItem | null> {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "data", "events.json"),
      "utf-8"
    );
    const events: EventItem[] = JSON.parse(raw);
    return events.find((e) => e.id === id) ?? null;
  } catch {
    return null;
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();
  return <EventDetailClient event={event} />;
}
