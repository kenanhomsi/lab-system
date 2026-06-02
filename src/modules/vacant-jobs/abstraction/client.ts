import { AxiosClient, AxiosModuleNames, AxiosState } from "@/modules/axios";
import { inject, injectable } from "inversify";

type FindAllParams = {
  endpoint: string;
};

type FindOneParams = {
  endpoint: string;
};

type SharedCreateAndUpdateParams = {
  endpoint: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isActive: boolean;
  sortOrder: number;
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

  protected sharedCreate(params: SharedCreateAndUpdateParams) {
    const { endpoint, ...body } = params;
    return this.axiosClient.post({ endpoint }).setBody(body);
  }

  protected sharedFindOne(params: FindOneParams) {
    return this.axiosClient.get({ endpoint: params.endpoint });
  }

  protected sharedUpdate(params: SharedCreateAndUpdateParams) {
    const { endpoint, ...body } = params;
    return this.axiosClient.put({ endpoint }).setBody(body);
  }

  protected sharedDelete(params: SharedDeleteParams) {
    return this.axiosClient.delete({ endpoint: params.endpoint });
  }
}

export { Client as VacantJobClient };
