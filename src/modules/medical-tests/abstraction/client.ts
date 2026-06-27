import { AxiosClient, AxiosModuleNames, AxiosState } from "@/modules/axios";
import { inject, injectable } from "inversify";
import {
  ParameterSchemaInput,
  stringifyParameterSchema,
} from "./parameter-schema";

type FindOneParams = {
  endpoint: string;
};
type FindAllParams = {
  endpoint: string;
};

type sharedCreateAndUpdateParams = {
  endpoint: string;
  nameAr: string;
  nameEn: string;
  price: number;
  categoryMedicalId: number;
  sampleType: string;
  parameterSchema: ParameterSchemaInput;
  status: string;
};

type SharedDeleteParams = {
  endpoint: string;
};

@injectable()
abstract class Client<T extends AxiosState> {
  @inject(AxiosModuleNames.client) protected axiosClient: AxiosClient<T>;

  protected sharedFindAll(params: FindAllParams) {
    const { endpoint } = params;
    const res = this.axiosClient.get({ endpoint: endpoint });
    return res;
  }

  protected sharedCreate(params: sharedCreateAndUpdateParams) {
    const { endpoint, ...body } = params;
    const res = this.axiosClient.post({ endpoint: endpoint }).setBody({
      ...body,
      parameterSchema: stringifyParameterSchema(body.parameterSchema),
    });
    return res;
  }
  protected sharedFindOne(params: FindOneParams) {
    const { endpoint } = params;
    const res = this.axiosClient.get({
      endpoint: endpoint,
    });
    return res;
  }

  protected sharedUpdate(params: sharedCreateAndUpdateParams) {
    const { endpoint, ...body } = params;
    const res = this.axiosClient.put({ endpoint: endpoint }).setBody({
      ...body,
      parameterSchema: stringifyParameterSchema(body.parameterSchema),
    });
    return res;
  }

  protected sharedDelete(params: SharedDeleteParams) {
    const { endpoint } = params;
    const res = this.axiosClient.delete({ endpoint: endpoint });
    return res;
  }
}
export { Client as MedicalTestClient };
