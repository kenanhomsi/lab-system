import { AxiosClient, AxiosModuleNames, AxiosState } from "@/modules/axios";
import { inject, injectable } from "inversify";

type RegisterProps = {
  endpoint: string;
  email: string;
  password: string;
  fullName: string;
  city: string;
  phoneNumber: string;
  role: string;
};

type CheckEmailProps = {
  endpoint: string;
  email: string;
};

type ResetPasswordProps = {
  endpoint: string;
  email: string;
  token: string;
  newPassword: string;
};

@injectable()
abstract class Client<T extends AxiosState> {
  @inject(AxiosModuleNames.client) protected client: AxiosClient<T>;

  protected sharedLogin(params: {
    email: string;
    password: string;
    endpoint: string;
  }) {
    const { endpoint, ...body } = params;
    return this.client.post({ endpoint: endpoint }).setBody(body);
  }

  protected sharedRegister(params: RegisterProps) {
    const { endpoint, ...body } = params;
    return this.client.post({ endpoint: endpoint }).setBody(body);
  }

  protected sharedCheckEmail(params: CheckEmailProps) {
    const { endpoint, ...body } = params;
    return this.client.post({ endpoint: endpoint }).setBody(body);
  }

  protected sharedResetPassword(params: ResetPasswordProps) {
    const { endpoint, ...body } = params;
    return this.client.post({ endpoint: endpoint }).setBody(body);
  }
}

export { Client as AuthClient };
