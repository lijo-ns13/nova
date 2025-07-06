import { z } from "zod";
export const userIdSchema = z.object({
  userId: z.string().length(24, "Invalid company ID"),
});
