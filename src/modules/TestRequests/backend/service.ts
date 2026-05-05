import { inject, injectable } from "inversify";
import { testRequestModuleNames } from "../names";
import {
  CreateTestRequestParams,
  DeleteTestRequestParams,
  FindAllTestRequestParams,
  FindTestRequestParams,
  UpdateTestRequestParams,
} from "./types";
  import { TestRequestBackendClient } from "./client";

@injectable()
class Service {
  @inject(testRequestModuleNames.client)
  private Client: TestRequestBackendClient;

  async findAll(params: FindAllTestRequestParams) {
    const res = await this.Client.findAll(params);
    return res;
  }

  async create(params: CreateTestRequestParams) {
    const res = await this.Client.create(params);
    return res;
  }

  async findOne(params: FindTestRequestParams) {
    const res = await this.Client.findOne(params);
    return res;
  }

  async update(params: UpdateTestRequestParams) {
    const res = await this.Client.update(params);
    return res;
  }

  async delete(params: DeleteTestRequestParams) {
    const res = await this.Client.delete(params);
    return res;
  }
}

export { Service as TestRequestBackendService };
