import { injectable, injectFromBase } from "inversify";
import { UserClient } from "../abstraction";
import { BackendState } from "@/modules/axios";
import { endpoint } from "./endpoint";
import { SharedCreateTypeSchema } from "../abstraction/schemas/create";
import { SharedFindAllTypeSchema } from "../abstraction/schemas/find-all";
import { SharedUpdateTypeSchema } from "../abstraction/schemas/update";
import { ShardFindOneTypeSchema } from "../abstraction/schemas/find-one";
import { ChangePasswordTypeSchema } from "../abstraction/schemas/change-password";
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

type RolesResponseSchema = { message?: string };
type PermissionsResponseSchema = {
  permissions?: string[];
  [key: string]: unknown;
};

const appendQueryParams = (
  path: string,
  query?: Record<string, string | undefined>,
) => {
  if (!query) return path;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") {
      params.set(key, value);
    }
  }
  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
};

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends UserClient<BackendState> {
  async findAll(params: FindAllUserParams) {
    const { token, query } = params;
    const res = await super
      .sharedFindAll({ endpoint: appendQueryParams(endpoint.findAll, query) })
      .withAuth(token)
      .perform<SharedFindAllTypeSchema>();
    return res.data;
  }

  async create(params: CreateUserParams) {
    const { token, ...body } = params;
    const res = await super
      .sharedCreate({ endpoint: endpoint.create, ...body })
      .withAuth(token)
      .perform<SharedCreateTypeSchema>();
    return res.data;
  }

  async findOne(params: FindUserParams) {
    const { id, token } = params;
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(id) })
      .withAuth(token)
      .perform<ShardFindOneTypeSchema>();
    return res.data;
  }

  async update(params: UpdateUserParams) {
    const { id, token, ...body } = params;
    const res = await super
      .sharedUpdate({
        endpoint: endpoint.update(id),
        ...body,
      })
      .withAuth(token)
      .perform<SharedUpdateTypeSchema>();
    return res.data;
  }

  async delete(params: DeleteUserParams) {
    const { id, token } = params;
    const res = await super
      .sharedDelete({ endpoint: endpoint.delete(id) })
      .withAuth(token)
      .perform();
    return res.data;
  }

  async activate(params: ActivateUserParams) {
    const { id, token } = params;
    const res = await super
      .sharedActivate({ endpoint: endpoint.activate(id) })
      .withAuth(token)
      .perform();
    return res.data;
  }

  async deactivate(params: DeactivateUserParams) {
    const { id, token } = params;
    const res = await super
      .sharedDeactivate({ endpoint: endpoint.deactivate(id) })
      .withAuth(token)
      .perform();
    return res.data;
  }

  async assignRoles(params: AssignRolesParams) {
    const { id, token, roles } = params;
    const res = await super
      .sharedAssignRoles({ endpoint: endpoint.roles(id), roles })
      .withAuth(token)
      .perform<RolesResponseSchema>();
    return res.data;
  }

  async removeRoles(params: RemoveRolesParams) {
    const { id, token, roles } = params;
    const res = await super
      .sharedRemoveRoles({ endpoint: endpoint.roles(id), roles })
      .withAuth(token)
      .perform<RolesResponseSchema>();
    return res.data;
  }

  async getPermissions(params: GetPermissionsParams) {
    const { id, token } = params;
    const res = await super
      .sharedGetPermissions({ endpoint: endpoint.permissions(id) })
      .withAuth(token)
      .perform<PermissionsResponseSchema>();
    return res.data.data;
  }

  async assignPermissions(params: AssignPermissionsParams) {
    const { id, token, permissions } = params;
    const res = await super
      .sharedAssignPermissions({
        endpoint: endpoint.permissions(id),
        permissions,
      })
      .withAuth(token)
      .perform<PermissionsResponseSchema>();
    return res.data;
  }

  async replacePermissions(params: ReplacePermissionsParams) {
    const { id, token, permissions } = params;
    const res = await super
      .sharedReplacePermissions({
        endpoint: endpoint.permissions(id),
        permissions,
      })
      .withAuth(token)
      .perform<PermissionsResponseSchema>();
    return res.data;
  }

  async removePermission(params: RemovePermissionParams) {
    const { id, permission, token } = params;
    const res = await super
      .sharedRemovePermission({
        endpoint: endpoint.removePermission(id, encodeURIComponent(permission)),
      })
      .withAuth(token)
      .perform<PermissionsResponseSchema>();
    return res.data;
  }

  async getMe(params: GetMeParams) {
    const { token } = params;
    const res = await super
      .sharedFindOne({ endpoint: endpoint.me })
      .withAuth(token)
      .perform<ShardFindOneTypeSchema>();
    return res.data;
  }

  async updateMe(params: UpdateMeParams) {
    const { token, ...body } = params;
    const res = await super
      .sharedUpdate({
        endpoint: endpoint.updateMe,
        ...body,
      })
      .withAuth(token)
      .perform<SharedUpdateTypeSchema>();
    return res.data;
  }

  async changePasswordMe(params: ChangePasswordMeParams) {
    const { token, ...body } = params;
    const res = await super
      .sharedChangePassword({
        endpoint: endpoint.changePasswordMe,
        ...body,
      })
      .withAuth(token)
      .perform<ChangePasswordTypeSchema>();
    return res.data;
  }

  async requestDeletionMe(params: RequestDeletionMeParams) {
    const { token } = params;
    const res = await this.axiosClient
      .post({ endpoint: endpoint.requestDeletionMe })
      .withAuth(token)
      .perform();
    return res.data;
  }
}
export { Client as UserBackendClient };
