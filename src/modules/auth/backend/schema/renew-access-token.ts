import { object, string, array, infer as infer_ } from "zod";

const schema = object({
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
});

type RenewAccessTokenSchemaType = infer_<typeof schema>;

export { schema as renewAccessTokenSchema };
export type { RenewAccessTokenSchemaType };
