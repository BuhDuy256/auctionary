import { z } from "zod";
import { allowedSortFields } from "../../utils/constant.util";

export const sortOptionSchema = z.string().transform((val) => {
    return val.
        split(",").
        map((pair) => {
            const [field, direction] = pair.split(":");

            if (!allowedSortFields.includes(field as typeof allowedSortFields[number])) {
                throw new Error(`Invalid sort field: ${field}`);
            }

            const dir = direction.toLowerCase();
            if (dir !== "asc" && dir !== "desc") {
                throw new Error(`Invalid sort direction: ${direction}`);
            }

            return { field, direction: dir as "asc" | "desc" };
        });
}).optional();

export const productSearchQuerySchema = z.object({
    q: z.string().optional(),
    category: z.string().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    sort: sortOptionSchema,
}).refine((data) => data.q || data.category, {
    message: "At least one of 'q' or 'category' must be provided",
    path: ["q", "category"],
}).refine((data) => !(data.q && data.category), {
    message: "Cannot search by both 'q' and 'category' at the same time",
    path: ["q", "category"],
});

export type ProductSearchQuery = z.infer<typeof productSearchQuerySchema>;
export type SortOption = z.infer<typeof sortOptionSchema>;