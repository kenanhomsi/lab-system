import { inject, injectable } from "inversify";
import { externalPatientsModuleNames } from "../names";
import { ExternalPatientsFrontendClient } from "./client";
import type {
  CreateExternalPatientFrontendParams,
  FindAllExternalPatientsFrontendParams,
  FindOneExternalPatientFrontendParams,
  LinkDirectPatientFrontendParams,
} from "./types";

@injectable()
class Service {
  @inject(externalPatientsModuleNames.client)
  private Client: ExternalPatientsFrontendClient;

  async findAll(params?: FindAllExternalPatientsFrontendParams) {
    return this.Client.findAll(params);
  }

  async create(params: CreateExternalPatientFrontendParams) {
    return this.Client.create(params);
  }

  async findOne(params: FindOneExternalPatientFrontendParams) {
    return this.Client.findOne(params);
  }

  async linkDirectPatient(params: LinkDirectPatientFrontendParams) {
    return this.Client.linkDirectPatient(params);
  }
}

export { Service as ExternalPatientsFrontendService };
