const names = {
  client: Symbol.for("userClient"),
  service: Symbol.for("userService"),
  createUserCommand: Symbol.for("createUserCommand"),
  deleteUserCommand: Symbol.for("deleteUserCommand"),
  activateUserCommand: Symbol.for("activateUserCommand"),
  deactivateUserCommand: Symbol.for("deactivateUserCommand"),
  updateUserCommand: Symbol.for("updateUserCommand"),
  updateMeCommand: Symbol.for("updateMeCommand"),
  changePasswordMeCommand: Symbol.for("changePasswordMeCommand"),
  requestDeletionMeCommand: Symbol.for("requestDeletionMeCommand"),
};
export { names as userModuleNames };
