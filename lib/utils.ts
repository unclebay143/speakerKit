import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SPEAKERKIT_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://speakerkit.org";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

export const OG_IMAGE =
  "https://res.cloudinary.com/dpkl4o58w/image/upload/v1752910329/user_uploads/687366a4d77d42b1c72dabc7/6873cf5f23188d64fa20ee56/mczllhwhhmzq6rf9iula.png";

export const CLOUDINARY_FOLDER = "speakerkit";
