import { inject, injectable } from "inversify";
import { accessPolicyModuleNames } from "../names";
import { AccessPolicyBackendClient } from "./client";
import {
  CreateAccessPolicyParams,
  DeleteAccessPolicyParams,
  DisableAccessPolicyParams,
  EnableAccessPolicyParams,
  FindAllAccessPolicyParams,
  FindAllAccessPolicyTablesParams,
  FindAccessPolicyTableFieldsParams,
  FindOneAccessPolicyParams,
  UpdateAccessPolicyParams,
  ValidateAccessPolicyParams,
} from "./types";

@injectable()
class Service {
  @inject(accessPolicyModuleNames.client)
  private Client: AccessPolicyBackendClient;

  async findAll(params: FindAllAccessPolicyParams) {
    return this.Client.findAll(params);
  }

  async findAllTables(params: FindAllAccessPolicyTablesParams) {
    return this.Client.findAllTables(params);
  }

  async findTableFields(params: FindAccessPolicyTableFieldsParams) {
    return this.Client.findTableFields(params);
  }

  async create(params: CreateAccessPolicyParams) {
    return this.Client.create(params);
  }

  async findOne(params: FindOneAccessPolicyParams) {
    return this.Client.findOne(params);
  }

  async update(params: UpdateAccessPolicyParams) {
    return this.Client.update(params);
  }

  async delete(params: DeleteAccessPolicyParams) {
    return this.Client.delete(params);
  }

  async enable(params: EnableAccessPolicyParams) {
    return this.Client.enable(params);
  }

  async disable(params: DisableAccessPolicyParams) {
    return this.Client.disable(params);
  }

  async validate(params: ValidateAccessPolicyParams) {
    return this.Client.validate(params);
  }
}

export { Service as AccessPolicyBackendService };
