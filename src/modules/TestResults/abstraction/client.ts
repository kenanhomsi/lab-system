import { AxiosClient, AxiosModuleNames, AxiosState } from "@/modules/axios";
import { inject, injectable } from "inversify";

type FindOneParams = {
  endpoint: string;
};
type FindAllParams = {
  endpoint: string;
};

type SharedCreateAndUpdateParams = {
  endpoint: string;
  resultDate: string;
  resultData: string;
  pdfUrl: string;
  status: string;
  /** Included when creating via BFF (`POST /test-results`) so the server can route to `for-test-request`. */
  testRequestId?: number;
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

  protected sharedCreate(params: SharedCreateAndUpdateParams) {
    const { endpoint, ...body } = params;
    const res = this.axiosClient.post({ endpoint: endpoint }).setBody(body);
    return res;
  }
  protected sharedFindOne(params: FindOneParams) {
    const { endpoint } = params;
    const res = this.axiosClient.get({
      endpoint: endpoint,
    });
    return res;
  }

  protected sharedUpdate(params: SharedCreateAndUpdateParams) {
    const { endpoint, ...body } = params;
    const res = this.axiosClient.put({ endpoint: endpoint }).setBody(body);
    return res;
  }

  protected sharedDelete(params: SharedDeleteParams) {
    const { endpoint } = params;
    const res = this.axiosClient.delete({ endpoint: endpoint });
    return res;
  }
}
export { Client as TestResultClient };
