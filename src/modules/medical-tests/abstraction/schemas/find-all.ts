import { z } from "zod";
import { MedicalTestItemSchema } from "./find-one";

export const sharedFindAllSchema = z.object({
  // data: z.object({
  //   items: z.array(MedicalTestItemSchema),
  //   page: z.number(),
  //   pageSize: z.number(),
  //   totalCount: z.number(),
  //   totalPages: z.number(),
  //   hasNextPage: z.boolean(),
  //   hasPreviousPage: z.boolean(),
  // }),
  data: z.array(MedicalTestItemSchema),
});

export type SharedFindAllTypeSchema = z.infer<typeof sharedFindAllSchema>;
