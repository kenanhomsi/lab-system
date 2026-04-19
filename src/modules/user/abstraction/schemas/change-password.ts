import { z } from "zod";

export const changePasswordSchema = z.object({
  message: z.string(),
});

export type ChangePasswordTypeSchema = z.infer<typeof changePasswordSchema>;
