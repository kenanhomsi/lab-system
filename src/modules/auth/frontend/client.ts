import { inject, injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
import { AuthClient } from "../abstraction";
import { signIn } from "next-auth/react";
import { eventModuleNames, EventService } from "@/modules/events";
import { RegisterSchemaType } from "../backend/schema/register";
import {
  RenewAccessTokenPayloadType,
  RenewAccessTokenSchemaType,
} from "../backend/schema/renew-access-token";
import { endpoint } from "./endpoint";

type loginParams = {
  email: string;
  password: string;
};

type RegisterFrontendProps = {
  email: string;
  password: string;
  fullName: string;
  city: string;
  phoneNumber: string;
  role: string;
};

type CheckEmailFrontendProps = { email: string };

type ResetPasswordFrontendProps = {
  email: string;
  code: number;
  newPassword: string;
};

const unwrapRenewAccessTokenResponse = (
  response: RenewAccessTokenSchemaType,
): RenewAccessTokenPayloadType => {
  return "data" in response ? response.data : response;
};

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends AuthClient<AxiosState> {
  @inject(eventModuleNames.service) private eventService: EventService;

  async Login(params: loginParams) {
    const { email, password } = params;
    const res = await signIn("credentials", {
      identifier: email,
      password,
      redirect: false,
    });
    if (res?.error) {
      this.eventService.emit("apiError", { message: res.error });
      throw new Error(res.error);
    }
    return res;
  }

  async RefreshToken(refreshToken: string) {
    const res = await this.client
      .post({ endpoint: endpoint.refreshToken })
      .setBody({ token: refreshToken })
      .perform<RenewAccessTokenSchemaType>();
    return unwrapRenewAccessTokenResponse(res.data);
  }

  async Register(params: RegisterFrontendProps) {
    const body = params;
    const res = await super
      .sharedRegister({
        ...body,
        endpoint: endpoint.register,
      })
      .perform<RegisterSchemaType>();
    return res.data;
  }

  async CheckEmail(params: CheckEmailFrontendProps) {
    const body = params;
    const res = await super
      .sharedCheckEmail({
        ...body,
        endpoint: endpoint.checkEmail,
      })
      .perform();
    return res.data;
  }

  async ForgotPassword(params: CheckEmailFrontendProps) {
    const res = await this.client
      .post({ endpoint: endpoint.forgotPassword })
      .setBody(params)
      .perform();
    return res.data;
  }

  async ResetPassword(params: ResetPasswordFrontendProps) {
    const body = params;
    const res = await super
      .sharedResetPassword({
        ...body,
        endpoint: endpoint.resetPassword,
      })
      .perform();
    return res.data;
  }
}

export { Client as AuthFrontClient };
export type {
  CheckEmailFrontendProps,
  loginParams,
  RegisterFrontendProps,
  ResetPasswordFrontendProps,
};
