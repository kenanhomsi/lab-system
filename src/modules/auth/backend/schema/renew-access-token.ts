import { object, string, array, union, infer as infer_ } from "zod";

const tokenPayloadSchema = object({
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

const schema = union([
  tokenPayloadSchema,
  object({
    data: tokenPayloadSchema,
  }),
]);

type RenewAccessTokenSchemaType = infer_<typeof schema>;
type RenewAccessTokenPayloadType = infer_<typeof tokenPayloadSchema>;

export { schema as renewAccessTokenSchema };
export type { RenewAccessTokenSchemaType, RenewAccessTokenPayloadType };
