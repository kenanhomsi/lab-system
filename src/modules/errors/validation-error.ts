import { BaseError } from "./base";
type ConstructorParams = {
  message: string;
  name: string;
};
class Error extends BaseError<ConstructorParams[]> {
  override getType(): string {
    return "validation error";
  }
}
export { Error as ValidationError };
