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
  content?: string;
  gallery?: string[];
}
