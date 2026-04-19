import { AxiosClient, AxiosModuleNames, AxiosState } from "@/modules/axios";
import { inject, injectable } from "inversify";

type FindAllParams = {
  endpoint: string;
};

type UpdateStatusParams = {
  endpoint: string;
  status: string;
};

@injectable()
abstract class Client<T extends AxiosState> {
  @inject(AxiosModuleNames.client) protected axiosClient: AxiosClient<T>;

  protected sharedFindAll(params: FindAllParams) {
    return this.axiosClient.get({ endpoint: params.endpoint });
  }

  protected sharedUpdateStatus(params: UpdateStatusParams) {
    const { endpoint, ...body } = params;
    return this.axiosClient.put({ endpoint }).setBody(body);
  }
}

export { Client as ComplaintClient };
