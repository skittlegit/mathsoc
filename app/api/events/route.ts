import { promises as fs } from "fs";
import path from "path";

export interface EventItem {
  id: string;
  year: number;
  date: string;
  title: string;
  full: string;
  location: string;
  desc: string;
  tag: string;
  photo?: string;
}

const DATA_PATH = path.join(process.cwd(), "data", "events.json");

async function readEvents(): Promise<EventItem[]> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeEvents(events: EventItem[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(events, null, 2), "utf-8");
}

export async function GET() {
  const events = await readEvents();
  return Response.json(events);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { id, year, date, title, full, location, desc, tag } = body;
  if (!id || !year || !date || !title || !full || !location || !desc || !tag) {
    return Response.json({ error: "All fields are required" }, { status: 400 });
  }

  const events = await readEvents();
  const existing = events.findIndex((e) => e.id === id);
  const event: EventItem = {
    id: String(id).slice(0, 100),
    year: Number(year),
    date: String(date).slice(0, 50),
    title: String(title).slice(0, 100),
    full: String(full).slice(0, 200),
    location: String(location).slice(0, 100),
    desc: String(desc).slice(0, 1000),
    tag: String(tag).slice(0, 50),
    ...(body.photo ? { photo: String(body.photo).slice(0, 500) } : {}),
  };

  if (existing >= 0) {
    events[existing] = event;
  } else {
    events.unshift(event);
  }

  events.sort((a, b) => b.year - a.year || b.date.localeCompare(a.date));
  await writeEvents(events);
  return Response.json(event, { status: existing >= 0 ? 200 : 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  const events = await readEvents();
  const filtered = events.filter((e) => e.id !== id);
  if (filtered.length === events.length) {
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  await writeEvents(filtered);
  return Response.json({ ok: true });
}
