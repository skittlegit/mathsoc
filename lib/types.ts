export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
  photoPosition?: string;
  photoScale?: number;
  content?: string;
  gallery?: string[];
  link?: string;
  author?: string;
}

export interface Announcement {
  id: string;
  text: string;
  link?: string; // optional URL to navigate to
  active: boolean;
  createdAt: string; // ISO date string
}
