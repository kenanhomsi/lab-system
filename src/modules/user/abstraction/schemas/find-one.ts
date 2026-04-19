import { z } from "zod";

export const userItemSchema = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string(),
  city: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  isActive: z.boolean(),
  emailConfirmed: z.boolean(),
  lockoutEnabled: z.boolean().optional(),
  lockoutEnd: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
  roles: z.array(z.string()).optional(),
  profileMetadata: z.string().nullable().optional(),
});

export const shardFindOneSchema = userItemSchema;

export type UserItemSchemaType = z.infer<typeof userItemSchema>;
export type ShardFindOneTypeSchema = z.infer<typeof shardFindOneSchema>;
export { shardFindOneSchema as findOneUserSchema };
