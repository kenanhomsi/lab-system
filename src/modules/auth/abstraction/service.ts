import { inject, injectable } from "inversify";
import { authModuleNames } from "../names";
import { AuthBackendClient } from "../backend";

type RegisterProps = {
  email: string;
  password: string;
  fullName: string;
  city: string;
  phoneNumber: string;
  role: string;
};

type CheckEmailProps = {
  email: string;
};

type ForgotPasswordProps = {
  email: string;
};

type ResetPasswordProps = {
  email: string;
  token: string;
  newPassword: string;
};

@injectable()
class Service<T extends AuthBackendClient = AuthBackendClient> {
  @inject(authModuleNames.client) protected client: T;

  async login(params: { email: string; password: string }) {
    const res = await this.client.Login(params);
    return res;
  }

  async Register(params: RegisterProps) {
    const res = await this.client.Register(params);
    return res;
  }

  async CheckEmail(params: CheckEmailProps) {
    const res = await this.client.CheckEmail(params);
    return res;
  }

  async ForgotPassword(params: ForgotPasswordProps) {
    const res = await this.client.ForgotPassword(params);
    return res;
  }

  async ResetPassword(params: ResetPasswordProps) {
    const res = await this.client.ResetPassword(params);
    return res;
  }
}

export { Service as AuthService };
export type {
  RegisterProps,
  CheckEmailProps,
  ForgotPasswordProps,
  ResetPasswordProps,
};
