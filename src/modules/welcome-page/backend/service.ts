import { inject, injectable } from "inversify";
import { welcomePageModuleNames } from "../names";
import { WelcomePageBackendClient } from "./client";
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
  private Client: WelcomePageBackendClient;

  async findAll(params: FindAllWelcomePageParams) {
    return this.Client.Find(params);
  }

  async findAllPublic() {
    return this.Client.FindPublic();
  }

  async findOne(params: FindOneWelcomePageParams) {
    return this.Client.FindOne(params);
  }

  async create(params: CreateWelcomePageParams) {
    return this.Client.Create(params);
  }

  async update(params: UpdateWelcomePageParams) {
    return this.Client.Update(params);
  }

  async delete(params: DeleteWelcomePageParams) {
    return this.Client.Delete(params);
  }
}

export { Service as WelcomePageBackendService };
