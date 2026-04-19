import { inject, injectable } from "inversify";
import { permissionModuleNames } from "../names";
import { PermissionBackendClient } from "./client";
import {
  CreatePermissionParams,
  DeletePermissionParams,
  FindAllPermissionParams,
  FindOnePermissionParams,
  UpdatePermissionParams,
} from "./types";

@injectable()
class Service {
  @inject(permissionModuleNames.client)
  private Client: PermissionBackendClient;

  async findAll(params: FindAllPermissionParams) {
    return this.Client.findAll(params);
  }

  async create(params: CreatePermissionParams) {
    return this.Client.create(params);
  }

  async findOne(params: FindOnePermissionParams) {
    return this.Client.findOne(params);
  }

  async update(params: UpdatePermissionParams) {
    return this.Client.update(params);
  }

  async delete(params: DeletePermissionParams) {
    return this.Client.delete(params);
  }
}

export { Service as PermissionBackendService };
