import { registerSchema } from "@/lib/validation";

/** Register form validation (shared Zod rules from lib/validation). */
const schema = () => registerSchema;

export { schema as registerValidationSchema };
