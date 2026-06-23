import { AxiosClient, AxiosModuleNames, AxiosState } from "@/modules/axios";
import { inject, injectable } from "inversify";

type EndpointParams = {
  endpoint: string;
};

type JsonParams = EndpointParams & {
  body: object;
};

@injectable()
abstract class Client<T extends AxiosState> {
  @inject(AxiosModuleNames.client) protected axiosClient: AxiosClient<T>;

  protected sharedGet(params: EndpointParams) {
    return this.axiosClient.get({ endpoint: params.endpoint });
  }

  protected sharedPostJson(params: JsonParams) {
    return this.axiosClient.post({ endpoint: params.endpoint }).setBody(params.body);
  }

  protected sharedPatchJson(params: JsonParams) {
    return this.axiosClient.patch({ endpoint: params.endpoint }).setBody(params.body);
  }

  protected sharedDelete(params: EndpointParams) {
    return this.axiosClient.delete({ endpoint: params.endpoint });
  }
}

export { Client as PageClient };
