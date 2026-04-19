import { inject, injectable } from "inversify";
import { subscriptionPackageModuleNames } from "../names";
import { SubscriptionPackageFrontendClient } from "./client";
import {
  ActivateSubscriptionPackageParams,
  CreateSubscriptionPackageParams,
  DeactivateSubscriptionPackageParams,
  FindAllSubscriptionPackageParams,
  FindOneSubscriptionPackageParams,
  UpdateSubscriptionPackageParams,
} from "./types";

@injectable()
class Service {
  @inject(subscriptionPackageModuleNames.client)
  private Client: SubscriptionPackageFrontendClient;

  async findAll(params: FindAllSubscriptionPackageParams) {
    return this.Client.findAll(params);
  }

  async create(params: CreateSubscriptionPackageParams) {
    return this.Client.create(params);
  }

  async findOne(params: FindOneSubscriptionPackageParams) {
    return this.Client.findOne(params);
  }

  async update(params: UpdateSubscriptionPackageParams) {
    return this.Client.update(params);
  }

  async activate(params: ActivateSubscriptionPackageParams) {
    return this.Client.activate(params);
  }

  async deactivate(params: DeactivateSubscriptionPackageParams) {
    return this.Client.deactivate(params);
  }
}

export { Service as SubscriptionPackageFrontendService };
