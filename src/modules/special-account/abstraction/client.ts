import { AxiosClient, AxiosModuleNames, AxiosState } from "@/modules/axios";
import { inject, injectable } from "inversify";

type EndpointParams = { endpoint: string };

@injectable()
abstract class Client<T extends AxiosState> {
  @inject(AxiosModuleNames.client) protected axiosClient: AxiosClient<T>;

  protected sharedGet(params: EndpointParams) {
    return this.axiosClient.get({ endpoint: params.endpoint });
  }

  protected sharedPost(params: EndpointParams & { body: object }) {
    return this.axiosClient.post({ endpoint: params.endpoint }).setBody(params.body);
  }

  protected sharedPatch(params: EndpointParams & { body: object }) {
    return this.axiosClient.patch({ endpoint: params.endpoint }).setBody(params.body);
  }

  protected sharedDelete(params: EndpointParams) {
    return this.axiosClient.delete({ endpoint: params.endpoint });
  }
}

export { Client as SpecialAccountClient };
