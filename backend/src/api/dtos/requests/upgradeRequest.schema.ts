import z from "zod";

export const submitUpgradeRequestSchema = z.object({
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(500, "Message must not exceed 500 characters")
    .regex(
      /^[a-zA-Z0-9\s.,!?'"()-]+$/,
      "Message must contain only text and basic punctuation"
    ),
});

export type SubmitUpgradeRequestSchema = z.infer<
  typeof submitUpgradeRequestSchema
>;
