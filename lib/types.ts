export interface EventItem {
  id: string;
  slug: string;
  year: number;
  date: string;
  title: string;
  full: string;
  location: string;
  desc: string;
  tag: string;
  photo?: string;
  photoPosition?: string; // e.g. "50% 30%" for object-position
  photoScale?: number; // e.g. 1.5 for 150% zoom
  content?: string;
  gallery?: string[];
  link?: string; // optional external URL (e.g. mcse.in)
  author?: string; // optional event author
  coverEvent?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  location: string;
  date: string;       // e.g. "April 15, 2026"
  time: string;       // e.g. "4:00 PM"
  link?: string;      // optional URL
  prizePool?: string; // optional e.g. "₹10,000"
  active: boolean;
  createdAt: string;  // ISO date string
}
