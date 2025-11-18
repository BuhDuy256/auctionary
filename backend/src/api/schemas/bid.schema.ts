import { z } from "zod";

export const placebidSchema = z.object({
    product_id: z.number().int().positive(),
    user_id: z.number().int().positive(),
    bid_amount: z.number().positive(),
});

export type PlaceBidDto = z.infer<typeof placebidSchema>;