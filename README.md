# MathSoc — Mathematics Society Website

Official website of the **Mathematics Society at Mahindra University**. Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and Framer Motion.

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero with blackjack, who-we-are, focus areas, marquee, CTA |
| `/events` | Events listing with year filter; each event links to `/events/[id]` |
| `/events/[id]` | Event detail — cover image, full content, gallery grid |
| `/team` | Team cards organized by year and role section |
| `/gallery` | Masonry photo gallery |
| `/resources` | Curated books, platforms, and tools |
| `/contact` | Contact form + email/location sidebar |
| `/admin` | Password-gated admin panel to create/edit/delete events |

---

## Stack

- **Next.js 16** (App Router)
- **React 19** + **TypeScript 5**
- **Tailwind CSS v4**
- **Framer Motion 12**
- **Space Grotesk** + **JetBrains Mono** (Google Fonts)

---

## Data

Events are stored in `data/events.json` and managed via:

- `GET /api/events` — list all events
- `POST /api/events` — create or update an event (by `id`)
- `DELETE /api/events?id=<id>` — delete an event

Uploaded images are saved to `public/uploads/events/` via `POST /api/upload`.

Team data lives in `app/team/data/` as JSON files per year (e.g. `2024-25.json`).

---

## Dev

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Admin

Navigate to `/admin` and enter the password to manage events. From there you can:

- Create, edit, and delete events
- Upload cover images and gallery photos directly from your device
- Set event tags (Competition / Academic / Orientation)
