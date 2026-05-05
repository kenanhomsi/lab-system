import { AxiosState } from "@/modules/axios";
import { injectable, injectFromBase } from "inversify";
import { ExternalPatientsClientBase } from "../abstraction/client";
import { endpoint } from "./endpoint";
import type { ExternalPatient } from "../backend/types";
import type {
  CreateExternalPatientFrontendParams,
  FindOneExternalPatientFrontendParams,
  LinkDirectPatientFrontendParams,
} from "./types";

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends ExternalPatientsClientBase<AxiosState> {
  async findAll() {
    const res = await this.getEndpoint(endpoint.findAll).perform<ExternalPatient[]>();
    return res.data;
  }

  async create(params: CreateExternalPatientFrontendParams) {
    const res = await this.postJson(endpoint.create, params).perform<ExternalPatient>();
    return res.data;
  }

  async findOne(params: FindOneExternalPatientFrontendParams) {
    const { id } = params;
    const res = await this.getEndpoint(endpoint.findOne(id)).perform<ExternalPatient>();
    return res.data;
  }

  async linkDirectPatient(params: LinkDirectPatientFrontendParams) {
    const { id, directPatientUserId } = params;
    const res = await this.postJson(endpoint.linkDirectPatient(id), {
      directPatientUserId,
    }).perform();
    if (res.status !== 204) {
      throw new Error(`Link direct patient failed with status ${String(res.status)}`);
    }
  }
}

export { Client as ExternalPatientsFrontendClient };
