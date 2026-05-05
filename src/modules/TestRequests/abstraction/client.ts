import { AxiosClient, AxiosModuleNames, AxiosState } from "@/modules/axios";
import { inject, injectable } from "inversify";
import { toRequestDateIso } from "./request-date-iso";

type FindOneParams = {
  endpoint: string;
};
type FindAllParams = {
  endpoint: string;
};

type sharedCreateAndUpdateParams = {
  endpoint: string;
  medicalTestId: number;
  requestDate: string;
  status: string;
  totalAmount: number;
  notes: string;
  metadata: string;
  doctorId: string | null;
  labClientId: string | null;
  directPatientId: string | null;
  externalPatientId: number;
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
    const res = this.axiosClient
      .post({ endpoint: endpoint })
      .setBody({ ...body, requestDate: toRequestDateIso(body.requestDate) });
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
    const res = this.axiosClient
      .put({ endpoint: endpoint })
      .setBody({ ...body, requestDate: toRequestDateIso(body.requestDate) });
    return res;
  }

  protected sharedDelete(params: SharedDeleteParams) {
    const { endpoint } = params;
    const res = this.axiosClient.delete({ endpoint: endpoint });
    return res;
  }
}
export { Client as TestRequestClient };
