import { inject, injectable } from "inversify";
import { welcomePageModuleNames } from "../names";
import { WelcomePageFrontendClient } from "./client";
import type {
  CreateWelcomePageParams,
  DeleteWelcomePageParams,
  FindAllWelcomePageParams,
  FindOneWelcomePageParams,
  UpdateWelcomePageParams,
} from "./types";

@injectable()
class Service {
  @inject(welcomePageModuleNames.client)
  private Client: WelcomePageFrontendClient;

  async findAll(params: FindAllWelcomePageParams) {
    return this.Client.findAll(params);
  }

  async findAllPublic() {
    return this.Client.findAllPublic();
  }

  async findOne(params: FindOneWelcomePageParams) {
    return this.Client.findOne(params);
  }

  async create(params: CreateWelcomePageParams) {
    return this.Client.create(params);
  }

  async update(params: UpdateWelcomePageParams) {
    return this.Client.update(params);
  }

  async delete(params: DeleteWelcomePageParams) {
    return this.Client.delete(params);
  }
}

export { Service as WelcomePageFrontendService };
