import { inject, injectable } from "inversify";
import { userModuleNames } from "../names";
import {
  ActivateUserParams,
  AssignPermissionsParams,
  AssignRolesParams,
  ChangePasswordMeParams,
  CreateUserParams,
  DeactivateUserParams,
  DeleteUserParams,
  FindAllUserParams,
  FindOneUserParams,
  GetMeParams,
  GetPermissionsParams,
  RemovePermissionParams,
  RemoveRolesParams,
  ReplacePermissionsParams,
  RequestDeletionMeParams,
  UpdateMeParams,
  UpdateUserParams,
} from "./types";
import { UserFrontendClient } from "./client";

@injectable()
class Service {
  @inject(userModuleNames.client) private Client: UserFrontendClient;

  async findAll(params: FindAllUserParams) {
    const res = await this.Client.findAll(params);
    return res;
  }

  async create(params: CreateUserParams) {
    const res = await this.Client.create(params);
    return res;
  }

  async findOne(params: FindOneUserParams) {
    const res = await this.Client.findOne(params);
    return res;
  }

  async update(params: UpdateUserParams) {
    const res = await this.Client.update(params);
    return res;
  }

  async delete(params: DeleteUserParams) {
    const res = await this.Client.delete(params);
    return res;
  }

  async activate(params: ActivateUserParams) {
    const res = await this.Client.activate(params);
    return res;
  }

  async deactivate(params: DeactivateUserParams) {
    const res = await this.Client.deactivate(params);
    return res;
  }

  async assignRoles(params: AssignRolesParams) {
    const res = await this.Client.assignRoles(params);
    return res;
  }

  async removeRoles(params: RemoveRolesParams) {
    const res = await this.Client.removeRoles(params);
    return res;
  }

  async getPermissions(params: GetPermissionsParams) {
    const res = await this.Client.getPermissions(params);
    return res;
  }

  async assignPermissions(params: AssignPermissionsParams) {
    const res = await this.Client.assignPermissions(params);
    return res;
  }

  async replacePermissions(params: ReplacePermissionsParams) {
    const res = await this.Client.replacePermissions(params);
    return res;
  }

  async removePermission(params: RemovePermissionParams) {
    const res = await this.Client.removePermission(params);
    return res;
  }

  async getMe(params: GetMeParams) {
    const res = await this.Client.getMe(params);
    return res;
  }

  async updateMe(params: UpdateMeParams) {
    const res = await this.Client.updateMe(params);
    return res;
  }

  async changePasswordMe(params: ChangePasswordMeParams) {
    const res = await this.Client.changePasswordMe(params);
    return res;
  }

  async requestDeletionMe(params: RequestDeletionMeParams) {
    const res = await this.Client.requestDeletionMe(params);
    return res;
  }
}

export { Service as UserFrontendService };
