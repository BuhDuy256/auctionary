import { z } from "zod";

export const productSearchQuerySchema = z.object({
    q: z.string().optional(),
    category: z.string().optional(),
    parentCategory: z.string().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
}).refine((data) => {
    if (data.q && data.category) {
        return false; 
    }
    return true;
}, {
    message: "You can only search by Name (name) or Category (category), not both at the same time",
    path: ["name"],
});

export type ProductSearchQuery = z.infer<typeof productSearchQuerySchema>;