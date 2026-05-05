import { object, string, array, infer as infer_ } from "zod";

const schema = object({
  data: object({
    accessToken: string(),
    refreshToken: string(),
    expiresAt: string(),
    user: object({
      id: string(),
      email: string(),
      fullName: string(),
      roles: array(string()),
      permissions: array(string()),
    }),
  }),
});

type LoginSchemaType = infer_<typeof schema>;

export { schema as loginSchema };
export type { LoginSchemaType };
