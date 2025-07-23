export const MAX_FILE_SIZE = 300 * 1024; // 300KB
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export function formatMaxFileSize(size: number = MAX_FILE_SIZE): string {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)}MB`;
  }
  return `${Math.round(size / 1024)}KB`;
}
