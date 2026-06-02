import { z } from "zod";
import { VacantJobItemSchema } from "./find-one";

export const sharedFindAllSchema = z.object({
  items: z.array(VacantJobItemSchema),
  page: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export type SharedFindAllTypeSchema = z.infer<typeof sharedFindAllSchema>;
