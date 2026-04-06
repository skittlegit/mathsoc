import { readdirSync } from "fs";
import { join } from "path";
import GalleryClient from "./GalleryClient";

export default function GalleryPage() {
  const imgDir = join(process.cwd(), "public", "images", "gallery");
  const vidDir = join(process.cwd(), "public", "videos", "gallery");

  let images: string[] = [];
  let videos: string[] = [];

  try {
    images = readdirSync(imgDir)
      .filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
      .map((f) => `/images/gallery/${encodeURIComponent(f)}`);
  } catch {
    images = [];
  }

  try {
    videos = readdirSync(vidDir)
      .filter((f) => /\.(mp4|webm|mov)$/i.test(f))
      .map((f) => `/videos/gallery/${encodeURIComponent(f)}`);
  } catch {
    videos = [];
  }

  return <GalleryClient images={images} videos={videos} />;
}
