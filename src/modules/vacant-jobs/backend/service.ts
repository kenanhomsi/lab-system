import { inject, injectable } from "inversify";
import { vacantJobModuleNames } from "../names";
import {
  CreateVacantJobBackendParams,
  DeleteVacantJobBackendParams,
  FindAllVacantJobsBackendParams,
  FindVacantJobBackendParams,
  UpdateVacantJobBackendParams,
} from "./types";
import { VacantJobBackendClient } from "./client";

@injectable()
class Service {
  @inject(vacantJobModuleNames.client)
  private Client: VacantJobBackendClient;

  async findAll(params: FindAllVacantJobsBackendParams) {
    return this.Client.findAll(params);
  }

  async create(params: CreateVacantJobBackendParams) {
    return this.Client.create(params);
  }

  async findOne(params: FindVacantJobBackendParams) {
    return this.Client.findOne(params);
  }

  async update(params: UpdateVacantJobBackendParams) {
    return this.Client.update(params);
  }

  async delete(params: DeleteVacantJobBackendParams) {
    return this.Client.delete(params);
  }
}

export { Service as VacantJobBackendService };
