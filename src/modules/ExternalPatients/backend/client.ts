import { BackendState } from "@/modules/axios/backend/backend-state";
import { injectable, injectFromBase } from "inversify";
import { ExternalPatientsClientBase } from "../abstraction/client";
import { endpoint } from "./endpoint";
import type {
  CreateExternalPatientParams,
  ExternalPatient,
  FindAllExternalPatientsParams,
  FindOneExternalPatientParams,
  LinkDirectPatientParams,
} from "./types";

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends ExternalPatientsClientBase<BackendState> {
  async findAll(params: FindAllExternalPatientsParams) {
    const { token } = params;
    const res = await this.getEndpoint(endpoint.findAll)
      .withAuth(token)
      .perform<{ data: ExternalPatient[] }>();
    return res.data;
  }

  async create(params: CreateExternalPatientParams) {
    const { token, ...body } = params;
    const res = await this.postJson(endpoint.create, body)
      .withAuth(token)
      .perform<ExternalPatient>();
    return res.data;
  }

  async findOne(params: FindOneExternalPatientParams) {
    const { token, id } = params;
    const res = await this.getEndpoint(endpoint.findOne(id))
      .withAuth(token)
      .perform<ExternalPatient>();
    return res.data;
  }

  async linkDirectPatient(params: LinkDirectPatientParams) {
    const { token, id, directPatientUserId } = params;
    const res = await this.postJson(endpoint.linkDirectPatient(id), {
      directPatientUserId,
    })
      .withAuth(token)
      .perform();
    if (res.status !== 204) {
      throw new Error(`Link direct patient failed with status ${String(res.status)}`);
    }
  }
}

export { Client as ExternalPatientsBackendClient };
