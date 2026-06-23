import { inject, injectable } from "inversify";
import { adModuleNames } from "../names";
import { AdBackendClient } from "./client";
import type {
  CreateAdParams,
  DeleteAdParams,
  FindAllAdParams,
  FindOneAdParams,
  UpdateAdParams,
} from "./types";

@injectable()
class Service {
  @inject(adModuleNames.client)
  private Client: AdBackendClient;

  async findAll(params: FindAllAdParams) {
    return this.Client.Find(params);
  }

  async findAllPublic() {
    return this.Client.FindPublic();
  }

  async findOne(params: FindOneAdParams) {
    return this.Client.FindOne(params);
  }

  async create(params: CreateAdParams) {
    return this.Client.Create(params);
  }

  async update(params: UpdateAdParams) {
    return this.Client.Update(params);
  }

  async delete(params: DeleteAdParams) {
    return this.Client.Delete(params);
  }
}

export { Service as AdBackendService };
