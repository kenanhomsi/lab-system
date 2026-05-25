import { inject, injectable } from "inversify";
import { accessPolicyModuleNames } from "../names";
import { AccessPolicyFrontendClient } from "./client";
import {
  CreateAccessPolicyFrontendParams,
  DeleteAccessPolicyFrontendParams,
  DisableAccessPolicyFrontendParams,
  EnableAccessPolicyFrontendParams,
  FindAllAccessPolicyFrontendParams,
  FindAllAccessPolicyTablesFrontendParams,
  FindAccessPolicyTableFieldsFrontendParams,
  FindOneAccessPolicyFrontendParams,
  UpdateAccessPolicyFrontendParams,
  ValidateAccessPolicyFrontendParams,
} from "./types";

@injectable()
class Service {
  @inject(accessPolicyModuleNames.client)
  private Client: AccessPolicyFrontendClient;

  async findAll(params: FindAllAccessPolicyFrontendParams) {
    return this.Client.findAll(params);
  }

  async findAllTables(params?: FindAllAccessPolicyTablesFrontendParams) {
    return this.Client.findAllTables(params);
  }

  async findTableFields(params: FindAccessPolicyTableFieldsFrontendParams) {
    return this.Client.findTableFields(params);
  }

  async create(params: CreateAccessPolicyFrontendParams) {
    return this.Client.create(params);
  }

  async findOne(params: FindOneAccessPolicyFrontendParams) {
    return this.Client.findOne(params);
  }

  async update(params: UpdateAccessPolicyFrontendParams) {
    return this.Client.update(params);
  }

  async delete(params: DeleteAccessPolicyFrontendParams) {
    return this.Client.delete(params);
  }

  async enable(params: EnableAccessPolicyFrontendParams) {
    return this.Client.enable(params);
  }

  async disable(params: DisableAccessPolicyFrontendParams) {
    return this.Client.disable(params);
  }

  async validate(params: ValidateAccessPolicyFrontendParams) {
    return this.Client.validate(params);
  }
}

export { Service as AccessPolicyFrontendService };
