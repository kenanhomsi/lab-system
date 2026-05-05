import { z } from "zod";

export const forgotPasswordBodySchema = z.object({
  email: z.string().email(),
});

export const checkEmailBodySchema = forgotPasswordBodySchema;

export const resetPasswordBodySchema = z.object({
  email: z.string().email(),
  code: z.union([z.string(), z.number()]).transform((value) => Number(value)),
  newPassword: z.string().min(6),
});

export const registerBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
  city: z.string().min(1),
  phoneNumber: z.string().min(1),
  role: z.string().min(1),
});
