import { inject, injectable } from "inversify";
import { userModuleNames } from "../names";
import { UserBackendClient } from "./client";
import {
  ActivateUserParams,
  AssignPermissionsParams,
  AssignRolesParams,
  ChangePasswordMeParams,
  CreateUserParams,
  DeactivateUserParams,
  DeleteUserParams,
  FindAllUserParams,
  FindUserParams,
  GetMeParams,
  GetPermissionsParams,
  RemovePermissionParams,
  RemoveRolesParams,
  ReplacePermissionsParams,
  RequestDeletionMeParams,
  UpdateMeParams,
  UpdateUserParams,
} from "./types";
import {
  createBackUserSchema,
  findAllBackUserSchema,
  findOneBackUserSchema,
  updateBackUserSchema,
} from "./transformers";
import { changePasswordSchema } from "../abstraction/schemas/change-password";

@injectable()
class Service {
  @inject(userModuleNames.client) private Client: UserBackendClient;

  async findAll(params: FindAllUserParams) {
    const res = await this.Client.findAll(params);
    const transformed = findAllBackUserSchema.parse(res);
    return transformed;
  }

  async create(params: CreateUserParams) {
    const res = await this.Client.create(params);
    const transformed = createBackUserSchema.parse(res);
    return transformed;
  }

  async findOne(params: FindUserParams) {
    const res = await this.Client.findOne(params);
    const transformed = findOneBackUserSchema.parse(res);
    return transformed;
  }

  async update(params: UpdateUserParams) {
    const res = await this.Client.update(params);
    const transformed = updateBackUserSchema.parse(res);
    return transformed;
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
    const transformed = findOneBackUserSchema.parse(res);
    return transformed;
  }

  async updateMe(params: UpdateMeParams) {
    const res = await this.Client.updateMe(params);
    const transformed = updateBackUserSchema.parse(res);
    return transformed;
  }

  async changePasswordMe(params: ChangePasswordMeParams) {
    const res = await this.Client.changePasswordMe(params);
    const transformed = changePasswordSchema.parse(res);
    return transformed;
  }

  async requestDeletionMe(params: RequestDeletionMeParams) {
    const res = await this.Client.requestDeletionMe(params);
    return res;
  }
}

export { Service as UserBackendService };
