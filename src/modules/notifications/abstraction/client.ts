import { AxiosClient, AxiosModuleNames, AxiosState } from "@/modules/axios";
import { inject, injectable } from "inversify";

type EndpointParams = {
  endpoint: string;
};

type PostJsonParams = EndpointParams & {
  body: object;
};

type DeleteJsonParams = EndpointParams & {
  body: object;
};

@injectable()
abstract class Client<T extends AxiosState> {
  @inject(AxiosModuleNames.client) protected axiosClient: AxiosClient<T>;

  protected sharedGetJson(params: EndpointParams) {
    return this.axiosClient.get({ endpoint: params.endpoint });
  }

  protected sharedPostJson(params: PostJsonParams) {
    const { endpoint, body } = params;
    return this.axiosClient.post({ endpoint }).setBody(body);
  }

  protected sharedDeleteJson(params: DeleteJsonParams) {
    const { endpoint, body } = params;
    return this.axiosClient.delete({ endpoint }).setBody(body);
  }
}

export { Client as NotificationsClient };
