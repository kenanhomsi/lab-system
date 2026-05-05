import { injectable, injectFromBase } from "inversify";
import {
  AuthService,
  type CheckEmailProps,
  type RegisterProps,
  type ResetPasswordProps,
} from "../abstraction";
import { AuthBackendClient } from "./client";

@injectable()
@injectFromBase({ extendProperties: true })
class Service extends AuthService<AuthBackendClient> {
  async Login(params: { email: string; password: string }) {
    try {
      const res = await this.client.Login(params);
      return res;
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.title || "Something went wrong";
      throw new Error(message);
    }
  }

  async renewAccessToken(params: { refreshToken: string }) {
    const res = await this.client.renewAccessToken(params);
    return res;
  }

  override async Register(params: RegisterProps) {
    const res = await this.client.Register(params);
    return res;
  }

  override async CheckEmail(params: CheckEmailProps) {
    const res = await this.client.CheckEmail(params);
    return res;
  }

  override async ResetPassword(params: ResetPasswordProps) {
    const res = await this.client.ResetPassword(params);
    return res;
  }
}

export { Service as AuthBackendService };
