import { z } from "zod";

export const UserIdSchema = z.object({
  userId: z.string().length(24, "Invalid user ID"),
});
