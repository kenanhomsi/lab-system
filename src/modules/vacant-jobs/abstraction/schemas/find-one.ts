import { z } from "zod";

export const VacantJobItemSchema = z.object({
  id: z.number(),
  titleAr: z.string(),
  titleEn: z.string(),
  descriptionAr: z.string(),
  descriptionEn: z.string(),
  isActive: z.boolean(),
  sortOrder: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const shardFindOneSchema = VacantJobItemSchema;

export type VacantJobItemSchemaType = z.infer<typeof VacantJobItemSchema>;
export type ShardFindOneTypeSchema = z.infer<typeof shardFindOneSchema>;
export { shardFindOneSchema as findOneVacantJobSchema };
