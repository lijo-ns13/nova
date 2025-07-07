import { z } from "zod";

export const IdSchema = z.object({
  id: z.string().length(24, "Invalid company ID"),
});
