import { AxiosClient, AxiosModuleNames, AxiosState } from "@/modules/axios";
import { inject, injectable } from "inversify";

type FindAllParams = {
  endpoint: string;
};

type FindOneParams = {
  endpoint: string;
};

type BodyParams = {
  endpoint: string;
  body: Record<string, unknown>;
};

type DeleteParams = {
  endpoint: string;
};

type PatchParams = {
  endpoint: string;
};

@injectable()
abstract class Client<T extends AxiosState> {
  @inject(AxiosModuleNames.client) protected axiosClient: AxiosClient<T>;

  protected sharedFindAll(params: FindAllParams) {
    return this.axiosClient.get({ endpoint: params.endpoint });
  }

  protected sharedCreate(params: BodyParams) {
    return this.axiosClient.post({ endpoint: params.endpoint }).setBody(params.body);
  }

  protected sharedFindOne(params: FindOneParams) {
    return this.axiosClient.get({ endpoint: params.endpoint });
  }

  protected sharedUpdate(params: BodyParams) {
    return this.axiosClient.put({ endpoint: params.endpoint }).setBody(params.body);
  }

  protected sharedDelete(params: DeleteParams) {
    return this.axiosClient.delete({ endpoint: params.endpoint });
  }

  protected sharedPatch(params: PatchParams) {
    return this.axiosClient.patch({ endpoint: params.endpoint });
  }

  protected sharedPostValidate(params: BodyParams) {
    return this.axiosClient.post({ endpoint: params.endpoint }).setBody(params.body);
  }
}

export { Client as AccessPolicyClient };
