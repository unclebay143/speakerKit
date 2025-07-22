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

export const EXPERTISE_OPTIONS = [
  { value: "agriculture", label: "Agriculture, Food & Forestry" },
  { value: "arts", label: "Arts" },
  { value: "business", label: "Business & Management" },
  { value: "consumer", label: "Consumer Goods & Services" },
  { value: "energy", label: "Energy & Basic Resources" },
  { value: "environment", label: "Environment & Cleantech" },
  { value: "finance", label: "Finance & Banking" },
  { value: "government", label: "Government, Social Sector & Education" },
  { value: "health", label: "Health & Medical" },
  { value: "humanities", label: "Humanities & Social Sciences" },
  { value: "ict", label: "Information & Communications Technology" },
  { value: "law", label: "Law & Regulation" },
  { value: "manufacturing", label: "Manufacturing & Industrial Materials" },
  { value: "media", label: "Media & Information" },
  { value: "sciences", label: "Physical & Life Sciences" },
  { value: "realestate", label: "Real Estate & Architecture" },
  { value: "region", label: "Region & Country" },
  { value: "transport", label: "Transports & Logistics" },
  { value: "travel", label: "Travel & Tourism" },
];
export const TOPIC_OPTIONS = [
  { value: "react", label: "React" },
  { value: "graphql", label: "GraphQL" },
  { value: "leadership", label: "Leadership" },
  { value: "web3", label: "Web3" },
  { value: "typescript", label: "TypeScript" },
  { value: "testing", label: "Testing" },
];
export const CITY_OPTIONS = [
  "Lagos",
  "London",
  "New York",
  "San Francisco",
  "Berlin",
  "Nairobi",
  "Paris",
];
