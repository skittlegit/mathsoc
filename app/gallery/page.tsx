import { readdirSync } from "fs";
import { join } from "path";
import sizeOf from "image-size";
import GalleryClient from "./GalleryClient";
import type { GalleryImage } from "./GalleryClient";

export default function GalleryPage() {
  const imgDir = join(process.cwd(), "public", "images", "gallery");
  const vidDir = join(process.cwd(), "public", "videos", "gallery");

  let images: GalleryImage[] = [];
  let videos: string[] = [];

  try {
    images = readdirSync(imgDir)
      .filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
      .map((f) => {
        let w = 4, h = 3;
        try {
          const dim = sizeOf(join(imgDir, f));
          if (dim.width && dim.height) { w = dim.width; h = dim.height; }
        } catch { /* use fallback ratio */ }
        return { src: `/images/gallery/${encodeURIComponent(f)}`, w, h };
      });
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
