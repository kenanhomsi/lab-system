import { z } from "zod";
import { TestResultItemSchema } from "./find-one";

export const sharedFindAllSchema = z.array(TestResultItemSchema);

export type SharedFindAllTypeSchema = z.infer<typeof sharedFindAllSchema>;
