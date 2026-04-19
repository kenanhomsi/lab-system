import { object, string } from "zod";

const schema = (params: { t: (string: string) => string }) => {
  const { t } = params;
  return object({
    email: string({ error: () => t("required") }).email({ error: () => t("invalidEmail") }),
    password: string({ error: () => t("required") }).min(8, {
      message: t("passwordMinLength"),
    }),
  });
};
export { schema as loginValidationSchema };
