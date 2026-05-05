import { inject, injectable } from "inversify";
import { medicalTestModuleNames } from "../names";
import {
  CreateUserParams,
  DeleteUserParams,
  FindAllUserParams,
  FindUserParams,
  UpdateUserParams,
} from "./types";
import { MedicalTestBackendClient } from "./client";

@injectable()
class Service {
  @inject(medicalTestModuleNames.client)
  private Client: MedicalTestBackendClient;

  async findAll(params: FindAllUserParams) {
    const res = await this.Client.findAll(params);
    return res;
  }

  async create(params: CreateUserParams) {
    const res = await this.Client.create(params);
    return res;
  }

  async findOne(params: FindUserParams) {
    const res = await this.Client.findOne(params);
    return res;
  }

  async update(params: UpdateUserParams) {
    const res = await this.Client.update(params);
    return res;
  }

  async delete(params: DeleteUserParams) {
    const res = await this.Client.delete(params);
    return res;
  }
}

export { Service as MedicalTestBackendService };
