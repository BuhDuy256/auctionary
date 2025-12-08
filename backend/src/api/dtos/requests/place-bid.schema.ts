import { z } from "zod";

export const placeBidSchema = z.object({
  amount: z.number().positive(),
});

export type PlaceBidRequest = z.infer<typeof placeBidSchema>;
