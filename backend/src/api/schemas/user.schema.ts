import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().optional(),
  currentPassword: z
    .string()
    .min(1, "Current password is required to save changes"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type PaginationSchema = z.infer<typeof paginationSchema>;
