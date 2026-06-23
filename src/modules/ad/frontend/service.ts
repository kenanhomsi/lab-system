import { inject, injectable } from "inversify";
import { adModuleNames } from "../names";
import { AdFrontendClient } from "./client";
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
  private Client: AdFrontendClient;

  async findAll(params: FindAllAdParams) {
    return this.Client.findAll(params);
  }

  async findAllPublic() {
    return this.Client.findAllPublic();
  }

  async findOne(params: FindOneAdParams) {
    return this.Client.findOne(params);
  }

  async create(params: CreateAdParams) {
    return this.Client.create(params);
  }

  async update(params: UpdateAdParams) {
    return this.Client.update(params);
  }

  async delete(params: DeleteAdParams) {
    return this.Client.delete(params);
  }
}

export { Service as AdFrontendService };
