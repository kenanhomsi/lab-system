import { AxiosClient, AxiosModuleNames, AxiosState } from "@/modules/axios";
import { inject, injectable } from "inversify";

type FindAllParams = {
  endpoint: string;
};

type FindOneParams = {
  endpoint: string;
};

type SharedCreateParams = {
  endpoint: string;
  [key: string]: unknown;
};

type SharedUpdateParams = SharedCreateParams;

type SharedDeleteParams = {
  endpoint: string;
};

@injectable()
abstract class Client<T extends AxiosState> {
  @inject(AxiosModuleNames.client) protected axiosClient: AxiosClient<T>;

  protected sharedFindAll(params: FindAllParams) {
    return this.axiosClient.get({ endpoint: params.endpoint });
  }

  protected sharedCreate(params: SharedCreateParams) {
    const { endpoint, ...body } = params;
    return this.axiosClient.post({ endpoint }).setBody(body);
  }

  protected sharedFindOne(params: FindOneParams) {
    return this.axiosClient.get({ endpoint: params.endpoint });
  }

  protected sharedUpdate(params: SharedUpdateParams) {
    const { endpoint, ...body } = params;
    return this.axiosClient.put({ endpoint }).setBody(body);
  }

  protected sharedDelete(params: SharedDeleteParams) {
    return this.axiosClient.delete({ endpoint: params.endpoint });
  }
}

export { Client as BannerClient };
