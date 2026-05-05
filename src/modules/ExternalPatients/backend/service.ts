import { inject, injectable } from "inversify";
import { externalPatientsModuleNames } from "../names";
import { ExternalPatientsBackendClient } from "./client";
import type {
  CreateExternalPatientParams,
  FindAllExternalPatientsParams,
  FindOneExternalPatientParams,
  LinkDirectPatientParams,
} from "./types";

@injectable()
class Service {
  @inject(externalPatientsModuleNames.client)
  private Client: ExternalPatientsBackendClient;

  async findAll(params: FindAllExternalPatientsParams) {
    return this.Client.findAll(params);
  }

  async create(params: CreateExternalPatientParams) {
    return this.Client.create(params);
  }

  async findOne(params: FindOneExternalPatientParams) {
    return this.Client.findOne(params);
  }

  async linkDirectPatient(params: LinkDirectPatientParams) {
    return this.Client.linkDirectPatient(params);
  }
}

export { Service as ExternalPatientsBackendService };
