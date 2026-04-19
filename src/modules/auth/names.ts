const names = {
  client: Symbol.for("AuthClient"),
  service: Symbol.for("AuthService"),
  utils: Symbol.for("AuthBackendUtils"),
  loginCommand: Symbol.for("AuthLoginCommand"),
  registerCommand: Symbol.for("RegisterCommand"),
  resetPasswordCommand: Symbol.for("ResetPasswordCommand"),
  checkEmailCommand: Symbol.for("CheckEmailCommand"),
};
export { names as authModuleNames };
