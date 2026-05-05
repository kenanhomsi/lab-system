import { inject, injectable } from "inversify";
import { medicalTestModuleNames } from "../names";
import {
  DeleteMedicalTestParams,
  FindAllMedicalTestsParams,
  FindOneMedicalTestParams,
  CreateMedicalTestParams,
  UpdateMedicalTestParams,
} from "./types";
import { MedicalTestFrontendClient } from "./client";

@injectable()
class Service {
  @inject(medicalTestModuleNames.client)
  private Client: MedicalTestFrontendClient;

  async findAll(params: FindAllMedicalTestsParams) {
    const res = await this.Client.findAll(params);
    return res;
  }

  async create(params: CreateMedicalTestParams) {
    const res = await this.Client.create(params);
    return res;
  }

  async findOne(params: FindOneMedicalTestParams) {
    const res = await this.Client.findOne(params);
    return res;
  }

  async update(params: UpdateMedicalTestParams) {
    const res = await this.Client.update(params);
    return res;
  }

  async delete(params: DeleteMedicalTestParams) {
    const res = await this.Client.delete(params);
    return res;
  }
}

export { Service as MedicalTestFrontendService };
