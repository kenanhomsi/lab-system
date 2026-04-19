class Error<T> {
  private errors: T;

  getType() {
    return "base error";
  }
  getErrors(): T {
    return this.errors;
  }
  setErrors(errors: T) {
    this.errors = errors;
  }
}
export { Error as BaseError };
