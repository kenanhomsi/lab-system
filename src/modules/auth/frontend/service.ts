import { inject, injectable, injectFromBase } from "inversify";
import { AuthFrontClient, loginParams, RegisterFrontendProps } from "./client";
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
}

export { Service as AuthFrontendService };
