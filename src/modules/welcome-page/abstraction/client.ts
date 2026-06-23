import { AxiosClient, AxiosModuleNames, AxiosState } from "@/modules/axios";
import { inject, injectable } from "inversify";

type EndpointParams = {
  endpoint: string;
};

type FormDataParams = EndpointParams & {
  formData: FormData;
};

@injectable()
abstract class Client<T extends AxiosState> {
  @inject(AxiosModuleNames.client) protected axiosClient: AxiosClient<T>;

  protected sharedGet(params: EndpointParams) {
    return this.axiosClient.get({ endpoint: params.endpoint });
  }

  protected sharedPostFormData(params: FormDataParams) {
    return this.axiosClient.post({ endpoint: params.endpoint }).setBody(params.formData);
  }

  protected sharedPatchFormData(params: FormDataParams) {
    return this.axiosClient.patch({ endpoint: params.endpoint }).setBody(params.formData);
  }

  protected sharedDelete(params: EndpointParams) {
    return this.axiosClient.delete({ endpoint: params.endpoint });
  }
}

export { Client as WelcomePageClient };
