import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
import { endpoint } from "./endpoint";
import { AuthClient } from "../abstraction";
import {
  LoginSchemaType,
  RenewAccessTokenPayloadType,
  RenewAccessTokenSchemaType,
} from "./schema";
import { RegisterSchemaType } from "./schema/register";

type RegisterProps = {
  email: string;
  password: string;
  fullName: string;
  city: string;
  phoneNumber: string;
  role: string;
};

type CheckEmailProps = { email: string };
type ForgotPasswordProps = { email: string };
type ResetPasswordProps = {
  email: string;
  token: string;
  newPassword: string;
};

const unwrapRenewAccessTokenResponse = (
  response: RenewAccessTokenSchemaType,
): RenewAccessTokenPayloadType => {
  return "data" in response ? response.data : response;
};

@injectable()
@injectFromBase({ extendProperties: true })
class AuthBackendClient extends AuthClient<BackendState> {
  async Login(params: { email: string; password: string }) {
    const { email, password } = params;
    const res = await super
      .sharedLogin({ email, password, endpoint: endpoint.login })
      .perform<LoginSchemaType>();
    return res.data.data;
  }

  async renewAccessToken(params: { refreshToken: string }) {
    const { refreshToken } = params;
    const res = await this.client
      .post({ endpoint: endpoint.renewAccessToken })
      .setBody({ token: refreshToken })
      .perform<RenewAccessTokenSchemaType>();
    return unwrapRenewAccessTokenResponse(res.data);
  }

  async Register(params: RegisterProps) {
    const body = params;
    const res = await super
      .sharedRegister({ ...body, endpoint: endpoint.register })
      .perform<RegisterSchemaType>();
    return res.data;
  }

  async CheckEmail(params: CheckEmailProps) {
    const body = params;
    const res = await super
      .sharedCheckEmail({ ...body, endpoint: endpoint.checkEmail })
      .perform();
    return res.data;
  }

  async ForgotPassword(params: ForgotPasswordProps) {
    const res = await this.client
      .post({ endpoint: endpoint.forgotPassword })
      .setBody(params)
      .perform();
    return res.data;
  }

  async ResetPassword(params: ResetPasswordProps) {
    const res = await super
      .sharedResetPassword({
        ...params,
        endpoint: endpoint.resetPassword,
      })
      .perform();
    return res.data;
  }
}

export { AuthBackendClient };
