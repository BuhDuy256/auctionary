import { z } from "zod";

export const TransactionPaymentProofUploadSchema = z.object({
  shippingFullName: z
    .string()
    .min(1, "Full name is required")
    .max(255, "Full name is too long"),

  shippingAddress: z
    .string()
    .min(1, "Address is required"),

  shippingCity: z
    .string()
    .min(1, "City is required"),

  shippingPhoneNumber: z
    .string()
    .regex(/^(0|\+84)(\d{9,10})$/, "Invalid Vietnamese phone number"),

  paymentProof: z.any()
    .refine((file) => file !== null, "Payment proof file is required"),
});

export type TransactionPaymentProofUploadRequest = z.infer<typeof TransactionPaymentProofUploadSchema>;

export const TransactionShippingProofUploadSchema = z.object({
  paymentConfirmed: z
    .string()
    .transform((val) => val === "true" || val === "1")
    .refine((val) => val === true, "Payment confirmation is required"),

  shippingProof: z.any()
    .refine((file) => file !== null, "Shipping proof file is required"),
});

export type TransactionShippingProofUploadRequest = z.infer<typeof TransactionShippingProofUploadSchema>;