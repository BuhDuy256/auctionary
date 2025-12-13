import z from "zod";

// Schema for approving/rejecting upgrade requests
export const upgradeRequestActionSchema = z.object({
  id: z.coerce.number().int().positive("Request ID must be a positive integer"),
});

export const suspendUserSchema = z.object({
  id: z.coerce.number().int().positive("User ID must be a positive integer"),
});

export type UpgradeRequestActionSchema = z.infer<
  typeof upgradeRequestActionSchema
>;
export type SuspendUserSchema = z.infer<typeof suspendUserSchema>;
