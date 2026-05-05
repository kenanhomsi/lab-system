import { inject, injectable } from "inversify";
import { testResultModuleNames } from "../names";
import {
  CreateTestResultParams,
  DeleteTestResultParams,
  FindAllTestResultParams,
  FindTestResultParams,
  UpdateTestResultParams,
} from "./types";
import { TestResultBackendClient } from "./client";

@injectable()
class Service {
  @inject(testResultModuleNames.client)
  private Client: TestResultBackendClient;

  async findAll(params: FindAllTestResultParams) {
    const res = await this.Client.findAll(params);
    return res;
  }

  async create(params: CreateTestResultParams) {
    const res = await this.Client.create(params);
    return res;
  }

  async findOne(params: FindTestResultParams) {
    const res = await this.Client.findOne(params);
    return res;
  }

  async update(params: UpdateTestResultParams) {
    const res = await this.Client.update(params);
    return res;
  }

  async delete(params: DeleteTestResultParams) {
    const res = await this.Client.delete(params);
    return res;
  }
}

export { Service as TestResultBackendService };
