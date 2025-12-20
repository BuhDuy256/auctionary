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

export const TransactionDeliveryConfirmSchema = z.object({
  received: z.boolean(),
});

export type TransactionDeliveryConfirmRequest = z.infer<typeof TransactionDeliveryConfirmSchema>;

export const TransactionReviewSubmitSchema = z.object({
  rating: z.number().refine((val) => val === 1 || val === -1, {
    message: "Rating must be either 1 (positive) or -1 (negative)",
  }),
  comment: z.string().max(500).optional(),
});

export type TransactionReviewSubmitRequest = z.infer<typeof TransactionReviewSubmitSchema>;