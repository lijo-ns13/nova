export const mediaConfig = {
  maxFileSize: Number(process.env.MAX_FILE_SIZE) || 1024 * 1024 * 100, // 100MB
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/quicktime",
    "application/pdf",
  ] as const,
  s3BucketName: process.env.S3_BUCKET_NAME!,
  s3SignedUrlExpiry: Number(process.env.S3_SIGNED_URL_EXPIRY) || 3600, // seconds
};
