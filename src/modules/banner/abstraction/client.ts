import { AxiosClient, AxiosModuleNames, AxiosState } from "@/modules/axios";
import { inject, injectable } from "inversify";

type FindAllParams = {
  endpoint: string;
};

type SharedCreateParams = {
  endpoint: string;
  formData: FormData;
};

type SharedPutJsonParams = {
  endpoint: string;
  body: object;
};

type SharedDeleteParams = {
  endpoint: string;
};

@injectable()
abstract class Client<T extends AxiosState> {
  @inject(AxiosModuleNames.client) protected axiosClient: AxiosClient<T>;

  protected sharedFindAll(params: FindAllParams) {
    return this.axiosClient.get({ endpoint: params.endpoint });
  }

  protected sharedFindAllPublic(params: FindAllParams) {
    return this.axiosClient.get({ endpoint: params.endpoint });
  }

  protected sharedCreate(params: SharedCreateParams) {
    const { endpoint, formData } = params;
    return this.axiosClient.post({ endpoint }).setBody(formData);
  }

  protected sharedPutFormData(params: SharedCreateParams) {
    const { endpoint, formData } = params;
    return this.axiosClient.put({ endpoint }).setBody(formData);
  }

  protected sharedPutJson(params: SharedPutJsonParams) {
    const { endpoint, body } = params;
    return this.axiosClient.put({ endpoint }).setBody(body);
  }

  protected sharedDelete(params: SharedDeleteParams) {
    return this.axiosClient.delete({ endpoint: params.endpoint });
  }
}

export { Client as BannerClient };
