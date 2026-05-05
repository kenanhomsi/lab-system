import { inject, injectable } from "inversify";
import { testResultModuleNames } from "../names";
import {
  DeleteTestResultFrontendParams,
  FindAllTestResultsFrontendParams,
  FindOneTestResultFrontendParams,
  CreateTestResultFrontendParams,
  UpdateTestResultFrontendParams,
} from "./types";
import { TestResultFrontendClient } from "./client";

@injectable()
class Service {
  @inject(testResultModuleNames.client)
  private Client: TestResultFrontendClient;

  async findAll(params: FindAllTestResultsFrontendParams) {
    const res = await this.Client.findAll(params);
    return res;
  }

  async create(params: CreateTestResultFrontendParams) {
    const res = await this.Client.create(params);
    return res;
  }

  async findOne(params: FindOneTestResultFrontendParams) {
    const res = await this.Client.findOne(params);
    return res;
  }

  async update(params: UpdateTestResultFrontendParams) {
    const res = await this.Client.update(params);
    return res;
  }

  async delete(params: DeleteTestResultFrontendParams) {
    const res = await this.Client.delete(params);
    return res;
  }
}

export { Service as TestResultFrontendService };
