import { promises as fs } from "fs";
import path from "path";
import EventsClient from "./EventsClient";

export interface EventItem {
  id: string;
  year: number;
  date: string;
  title: string;
  full: string;
  location: string;
  desc: string;
  tag: string;
}

async function getEvents(): Promise<EventItem[]> {
  const raw = await fs.readFile(
    path.join(process.cwd(), "data", "events.json"),
    "utf-8"
  );
  return JSON.parse(raw);
}

export default async function EventsPage() {
  const events = await getEvents();
  return <EventsClient events={events} />;
}
