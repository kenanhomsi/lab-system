export { Validator };
import { ZodError, ZodType } from "zod";
import { ValidationError } from "../errors";
type ValidateParams = {
  data: unknown;
  schema: ZodType;
};
class Validator {
  validate(params: ValidateParams) {
    const { data, schema } = params;
    try {
      schema.parse(data);
    } catch (e) {
      if (e instanceof ZodError) {
        const errors = e.issues.map((issue) => {
          return {
            message: issue.message,
            name: String(issue.path[0]),
          };
        });
        const validationError = new ValidationError();
        validationError.setErrors(errors);
        throw validationError;
      }
      throw e;
    }
  }
}
