import { infer as infer_ } from "zod";
import { dashboardResponseSchema } from "../../abstraction/schemas";

const transformer = dashboardResponseSchema.transform((payload) => payload);

type DashboardBackSchemaType = infer_<typeof transformer>;

export { transformer as dashboardBackSchema };
export type { DashboardBackSchemaType };
