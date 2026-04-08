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
  content?: string;
  gallery?: string[];
}
