import { AxiosClient, AxiosModuleNames, AxiosState } from "@/modules/axios";
import { inject, injectable } from "inversify";

type FindAllParams = {
  endpoint: string;
};

type FindOneParams = {
  endpoint: string;
};

type SharedPostFormParams = {
  endpoint: string;
  formData: FormData;
};

type UpdateStatusParams = {
  endpoint: string;
  status: string;
  notes?: string;
  rejectionReason?: string;
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

  protected sharedFindOne(params: FindOneParams) {
    return this.axiosClient.get({ endpoint: params.endpoint });
  }

  protected sharedPostFormData(params: SharedPostFormParams) {
    const { endpoint, formData } = params;
    return this.axiosClient.post({ endpoint }).setBody(formData);
  }

  protected sharedUpdateStatus(params: UpdateStatusParams) {
    const { endpoint, status, notes, rejectionReason } = params;
    const body: Record<string, string> = { status };
    if (notes !== undefined) {
      body.notes = notes;
    }
    if (rejectionReason !== undefined) {
      body.rejectionReason = rejectionReason;
    }
    return this.axiosClient.put({ endpoint }).setBody(body);
  }

  protected sharedDelete(params: SharedDeleteParams) {
    return this.axiosClient.delete({ endpoint: params.endpoint });
  }
}

export { Client as InsuranceApprovalRequestClient };
