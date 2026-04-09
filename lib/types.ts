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
}

export interface Announcement {
  id: string;
  text: string;
  link?: string; // optional URL to navigate to
  active: boolean;
  createdAt: string; // ISO date string
}
