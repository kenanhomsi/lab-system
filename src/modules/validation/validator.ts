import { ZodError, ZodSchema } from "zod";
import { ValidationError } from "../errors";
type ValidateParams<T> = {
  data: T;
  schema: ZodSchema<T>;
};
class Validator {
  validate<T>(params: ValidateParams<Partial<T>>) {
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
export { Validator };
