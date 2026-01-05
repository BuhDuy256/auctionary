import z from "zod";

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name must contain only letters"),
  address: z.string().optional(),
});

export const updateEmailSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const getRatingsQuerySchema = z.object({
  role: z.enum(["buyer", "seller", "all"]).optional().default("all"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export const getUserByIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
export type UpdateEmailSchema = z.infer<typeof updateEmailSchema>;
export type GetRatingsQuerySchema = z.infer<typeof getRatingsQuerySchema>;
export type GetUserByIdParamSchema = z.infer<typeof getUserByIdParamSchema>;
