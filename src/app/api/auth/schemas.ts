import { z } from "zod";

export const forgotPasswordBodySchema = z.object({
  email: z.string().email(),
});

export const checkEmailBodySchema = forgotPasswordBodySchema;

export const resetPasswordBodySchema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
  newPassword: z.string().min(6),
});

export const registerBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
  city: z.string().min(1),
  phoneNumber: z.string().min(1),
  phoneVerificationToken: z.string().min(1).optional(),
  age: z.number().int().min(0).max(130).optional(),
  gender: z.enum(["male", "female"]).optional(),
  specialty: z.string().min(1).max(120).optional(),
  labName: z.string().min(1).max(120).optional(),
  role: z.enum(["patient", "doctor", "LabPartner"]),
}).superRefine((data, ctx) => {
  if (data.role === "patient" && data.age === undefined) {
    ctx.addIssue({ code: "custom", path: ["age"], message: "Age is required" });
  }
  if (data.role === "patient" && !data.gender) {
    ctx.addIssue({ code: "custom", path: ["gender"], message: "Gender is required" });
  }
  if (data.role === "doctor" && !data.specialty) {
    ctx.addIssue({ code: "custom", path: ["specialty"], message: "Specialty is required" });
  }
  if (data.role === "LabPartner" && !data.labName) {
    ctx.addIssue({ code: "custom", path: ["labName"], message: "Lab name is required" });
  }
});
