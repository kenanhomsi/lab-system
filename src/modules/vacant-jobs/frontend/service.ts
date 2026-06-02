import { inject, injectable } from "inversify";
import { vacantJobModuleNames } from "../names";
import {
  CreateVacantJobParams,
  DeleteVacantJobParams,
  FindAllVacantJobsParams,
  FindOneVacantJobParams,
  UpdateVacantJobParams,
} from "./types";
import { VacantJobFrontendClient } from "./client";

@injectable()
class Service {
  @inject(vacantJobModuleNames.client)
  private Client: VacantJobFrontendClient;

  async findAll(params: FindAllVacantJobsParams) {
    return this.Client.findAll(params);
  }

  async create(params: CreateVacantJobParams) {
    return this.Client.create(params);
  }

  async findOne(params: FindOneVacantJobParams) {
    return this.Client.findOne(params);
  }

  async update(params: UpdateVacantJobParams) {
    return this.Client.update(params);
  }

  async delete(params: DeleteVacantJobParams) {
    return this.Client.delete(params);
  }
}

export { Service as VacantJobFrontendService };
