import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function optimizeImageUrl(url: string | undefined | null, width = 600, quality = 75): string {
  if (!url) return "https://placehold.co/800x1000";
  if (url.includes("images.unsplash.com")) {
    try {
      const u = new URL(url);
      u.searchParams.set("auto", "format");
      u.searchParams.set("q", quality.toString());
      if (width > 0) u.searchParams.set("w", width.toString());
      return u.toString();
    } catch {
      return url;
    }
  }
  if (url.includes("images.pexels.com")) {
    try {
      const u = new URL(url);
      u.searchParams.set("auto", "compress");
      u.searchParams.set("cs", "tinysrgb");
      if (width > 0) u.searchParams.set("w", width.toString());
      return u.toString();
    } catch {
      return url;
    }
  }
  return url;
}

