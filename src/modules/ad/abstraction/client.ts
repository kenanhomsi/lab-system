import { AxiosClient, AxiosModuleNames, AxiosState } from "@/modules/axios";
import { inject, injectable } from "inversify";

type EndpointParams = {
  endpoint: string;
};

type SharedBodyParams = EndpointParams & {
  formData: FormData;
};

@injectable()
abstract class Client<T extends AxiosState> {
  @inject(AxiosModuleNames.client) protected axiosClient: AxiosClient<T>;

  protected sharedGet(params: EndpointParams) {
    return this.axiosClient.get({ endpoint: params.endpoint });
  }

  protected sharedPostFormData(params: SharedBodyParams) {
    return this.axiosClient.post({ endpoint: params.endpoint }).setBody(params.formData);
  }

  protected sharedPatchFormData(params: SharedBodyParams) {
    return this.axiosClient.patch({ endpoint: params.endpoint }).setBody(params.formData);
  }

  protected sharedDelete(params: EndpointParams) {
    return this.axiosClient.delete({ endpoint: params.endpoint });
  }
}

export { Client as AdClient };
