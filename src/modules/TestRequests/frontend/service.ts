import { inject, injectable } from "inversify";
import { testRequestModuleNames } from "../names";
import {
  DeleteTestRequestFrontendParams,
  FindAllTestRequestsFrontendParams,
  FindOneTestRequestFrontendParams,
  CreateTestRequestFrontendParams,
  UpdateTestRequestFrontendParams,
} from "./types";
import { TestRequestFrontendClient } from "./client";

@injectable()
class Service {
  @inject(testRequestModuleNames.client)
  private Client: TestRequestFrontendClient;

  async findAll(params: FindAllTestRequestsFrontendParams) {
    const res = await this.Client.findAll(params);
    return res;
  }

  async create(params: CreateTestRequestFrontendParams) {
    const res = await this.Client.create(params);
    return res;
  }

  async findOne(params: FindOneTestRequestFrontendParams) {
    const res = await this.Client.findOne(params);
    return res;
  }

  async update(params: UpdateTestRequestFrontendParams) {
    const res = await this.Client.update(params);
    return res;
  }

  async delete(params: DeleteTestRequestFrontendParams) {
    const res = await this.Client.delete(params);
    return res;
  }
}

export { Service as TestRequestFrontendService };
