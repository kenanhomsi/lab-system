import { AxiosClient, AxiosModuleNames, AxiosState } from "@/modules/axios";
import { inject, injectable } from "inversify";

type FindAllParams = {
  endpoint: string;
};

type FindOneParams = {
  endpoint: string;
};

type SharedCreateParams = {
  endpoint: string;
  appointmentTypeId: number;
  name: string;
  description: string;
  notes: string;
  slot: string;
  locationType: string;
  address: string;
  latitude: number;
  longitude: number;
  patientId: string;
  doctorId: string;
  labPartnerId: string;
};

type SharedActionParams = {
  endpoint: string;
};

@injectable()
abstract class Client<T extends AxiosState> {
  @inject(AxiosModuleNames.client) protected axiosClient: AxiosClient<T>;

  protected sharedFindAll(params: FindAllParams) {
    return this.axiosClient.get({ endpoint: params.endpoint });
  }

  protected sharedCreate(params: SharedCreateParams) {
    const { endpoint, ...body } = params;
    return this.axiosClient.post({ endpoint }).setBody(body);
  }

  protected sharedFindOne(params: FindOneParams) {
    return this.axiosClient.get({ endpoint: params.endpoint });
  }

  protected sharedConfirm(params: SharedActionParams) {
    return this.axiosClient.post({ endpoint: params.endpoint });
  }

  protected sharedCancel(params: SharedActionParams) {
    return this.axiosClient.post({ endpoint: params.endpoint });
  }
}

export { Client as AppointmentClient };
