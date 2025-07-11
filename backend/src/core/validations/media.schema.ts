import { z } from "zod";

export const StreamMediaSchema = z.object({
  mediaId: z.string().length(24, "Invalid mediaId"),
});

export const GetMediaByS3Schema = z.object({
  s3key: z.string().min(1, "s3key is required"),
});
