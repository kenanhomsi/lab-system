import { z } from "zod";

/** API may send numbers/booleans; UI expects a.display string or null. */
const nullableStringLike = z.preprocess((val: unknown) => {
  if (val == null || val === "") return null;
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  return null;
}, z.string().nullable());

/** Embedded on user list items — API may omit audit/metadata fields. */
export const accessPolicySchema = z.object({
  id: z.string(),
  resource: z.string(),
  action: z.string(),
  effect: z.string(),
  subjectType: z.string().optional(),
  subjectKey: z.string().optional(),
  condition: z.unknown().optional(),
  priority: z.preprocess(
    (val: unknown) => (typeof val === "number" ? val : Number(val) || 0),
    z.number(),
  ),
  isEnabled: z.preprocess(
    (val: unknown) => val === true || val === "true",
    z.boolean(),
  ),
  description: nullableStringLike.optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdByUserId: z.string().nullable().optional(),
  validFrom: z.string().nullable().optional(),
  validTo: z.string().nullable().optional(),
  deletedAt: z.string().nullable().optional(),
  updatedByUserId: z.string().nullable().optional(),
});

const rolesSchema = z.preprocess((val: unknown) => {
  if (!Array.isArray(val)) return undefined;
  return val.map((item) => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object" && "name" in item) {
      const name = (item as { name?: unknown }).name;
      return typeof name === "string" ? name : String(name ?? "");
    }
    return String(item);
  });
}, z.array(z.string()).optional());

export const userItemSchema = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string(),
  city: z.string().nullable(),
  phoneNumber: nullableStringLike,
  isActive: z.boolean(),
  emailConfirmed: z.boolean(),
  lockoutEnabled: z.boolean().optional(),
  lockoutEnd: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
  roles: rolesSchema,
  accessPolicies: z.array(accessPolicySchema).optional(),
  profileMetadata: z.string().nullable().optional(),
});

export const shardFindOneSchema = userItemSchema;

export type UserEmbeddedAccessPolicy = z.infer<typeof accessPolicySchema>;
export type UserItemSchemaType = z.infer<typeof userItemSchema>;
export type ShardFindOneTypeSchema = z.infer<typeof shardFindOneSchema>;
export { shardFindOneSchema as findOneUserSchema };
