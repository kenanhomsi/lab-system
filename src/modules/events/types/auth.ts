type events = {
  apiError: { message: string };
  LoginSucceeded: { roles: string[] };
  RegisterSucceeded: string;
  ResetPasswordSucceeded: string;
  checkEmailSucceeded: string;

  userCreatedSuccessfully: unknown;
  userUpdatedSuccessfully: unknown;
  userDeletedSuccessfully: unknown;
  userActivatedSuccessfully: unknown;
  userDeactivatedSuccessfully: unknown;
  appointmentCreatedSuccessfully: unknown;
  complaintStatusUpdatedSuccessfully: undefined;

  profileUpdatedSuccessfully: unknown;
  passwordChangedSuccessfully: unknown;
  accountDeletionRequestedSuccessfully: unknown;
};
export type { events as authEvents };
