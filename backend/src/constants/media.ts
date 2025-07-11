export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "application/pdf",
] as const;

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
