import { inject, injectable } from "inversify";
import { roleModuleNames } from "../names";
import { RoleBackendClient } from "./client";
import {
  AssignRolePermissionParams,
  CreateRoleParams,
  DeleteRoleParams,
  FindAllRoleParams,
  FindOneRoleParams,
  GetRolePermissionsParams,
  RemoveRolePermissionParams,
  UpdateRoleParams,
} from "./types";

@injectable()
class Service {
  @inject(roleModuleNames.client)
  private Client: RoleBackendClient;

  async findAll(params: FindAllRoleParams) {
    return this.Client.findAll(params);
  }

  async create(params: CreateRoleParams) {
    return this.Client.create(params);
  }

  async findOne(params: FindOneRoleParams) {
    return this.Client.findOne(params);
  }

  async update(params: UpdateRoleParams) {
    return this.Client.update(params);
  }

  async delete(params: DeleteRoleParams) {
    return this.Client.delete(params);
  }

  async getPermissions(params: GetRolePermissionsParams) {
    return this.Client.getPermissions(params);
  }

  async assignPermission(params: AssignRolePermissionParams) {
    return this.Client.assignPermission(params);
  }

  async removePermission(params: RemoveRolePermissionParams) {
    return this.Client.removePermission(params);
  }
}

export { Service as RoleBackendService };
