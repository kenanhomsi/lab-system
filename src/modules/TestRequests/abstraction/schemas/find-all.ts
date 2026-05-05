import { z } from "zod";
import { TestRequestItemSchema } from "./find-one";

export const sharedFindAllSchema = z.object({
  data: z.object({
    items: z.array(TestRequestItemSchema),
    page: z.number(),
    pageSize: z.number(),
    totalCount: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

export type SharedFindAllTypeSchema = z.infer<typeof sharedFindAllSchema>;
