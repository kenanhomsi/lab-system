import { inject, injectable, injectFromBase } from "inversify";
import {
  AuthFrontClient,
  CheckEmailFrontendProps,
  loginParams,
  RegisterFrontendProps,
  ResetPasswordFrontendProps,
} from "./client";
import { authModuleNames } from "../names";

@injectable()
@injectFromBase({ extendProperties: true })
class Service {
  @inject(authModuleNames.client) private client: AuthFrontClient;

  async login(params: loginParams) {
    const res = await this.client.Login(params);
    return res;
  }

  async Register(params: RegisterFrontendProps) {
    const res = await this.client.Register(params);
    return res;
  }

  async ForgotPassword(params: CheckEmailFrontendProps) {
    return this.client.ForgotPassword(params);
  }

  async ResetPassword(params: ResetPasswordFrontendProps) {
    return this.client.ResetPassword(params);
  }

  async CheckEmail(params: CheckEmailFrontendProps) {
    return this.client.CheckEmail(params);
  }
}

export { Service as AuthFrontendService };
