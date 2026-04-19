import { injectable, injectFromBase } from "inversify";
import { UserClient } from "../abstraction";
import { AxiosState } from "@/modules/axios";
import { endpoint } from "./endpoint";
import {
  CreateBackUserSchemaType,
  FindAllBackUserSchemaType,
  FindOneBackUserSchemaType,
  UpdateBackUserSchemaType,
} from "../backend/transformers";
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

type RolesResponseSchema = { message?: string };
type PermissionsResponseSchema = { permissions?: string[]; [key: string]: unknown };

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
class Client extends UserClient<AxiosState> {
  async findAll(params: FindAllUserParams) {
    const res = await super
      .sharedFindAll({ endpoint: appendQueryParams(endpoint.findAll, params.query) })
      .perform<FindAllBackUserSchemaType>();
    return res.data;
  }

  async create(params: CreateUserParams) {
    const res = await super
      .sharedCreate({
        endpoint: endpoint.create,
        ...params,
      })
      .perform<CreateBackUserSchemaType>();
    return res.data;
  }

  async findOne(params: FindOneUserParams) {
    const { id } = params;
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(id) })
      .perform<FindOneBackUserSchemaType>();
    return res.data;
  }

  async update(params: UpdateUserParams) {
    const { id, ...body } = params;
    const res = await super
      .sharedUpdate({
        endpoint: endpoint.update(id),
        ...body,
      })
      .perform<UpdateBackUserSchemaType>();
    return res.data;
  }

  async delete(params: DeleteUserParams) {
    const { id } = params;
    const res = await super
      .sharedDelete({
        endpoint: endpoint.delete(id),
      })
      .perform();
    return res.data;
  }

  async activate(params: ActivateUserParams) {
    const { id } = params;
    const res = await super
      .sharedActivate({
        endpoint: endpoint.activate(id),
      })
      .perform();
    return res.data;
  }

  async deactivate(params: DeactivateUserParams) {
    const { id } = params;
    const res = await super
      .sharedDeactivate({
        endpoint: endpoint.deactivate(id),
      })
      .perform();
    return res.data;
  }

  async assignRoles(params: AssignRolesParams) {
    const { id, roles } = params;
    const res = await super
      .sharedAssignRoles({
        endpoint: endpoint.roles(id),
        roles,
      })
      .perform<RolesResponseSchema>();
    return res.data;
  }

  async removeRoles(params: RemoveRolesParams) {
    const { id, roles } = params;
    const res = await super
      .sharedRemoveRoles({
        endpoint: endpoint.roles(id),
        roles,
      })
      .perform<RolesResponseSchema>();
    return res.data;
  }

  async getPermissions(params: GetPermissionsParams) {
    const { id } = params;
    const res = await super
      .sharedGetPermissions({
        endpoint: endpoint.permissions(id),
      })
      .perform<PermissionsResponseSchema>();
    return res.data;
  }

  async assignPermissions(params: AssignPermissionsParams) {
    const { id, permissions } = params;
    const res = await super
      .sharedAssignPermissions({
        endpoint: endpoint.permissions(id),
        permissions,
      })
      .perform<PermissionsResponseSchema>();
    return res.data;
  }

  async replacePermissions(params: ReplacePermissionsParams) {
    const { id, permissions } = params;
    const res = await super
      .sharedReplacePermissions({
        endpoint: endpoint.permissions(id),
        permissions,
      })
      .perform<PermissionsResponseSchema>();
    return res.data;
  }

  async removePermission(params: RemovePermissionParams) {
    const { id, permission } = params;
    const res = await super
      .sharedRemovePermission({
        endpoint: endpoint.removePermission(id, encodeURIComponent(permission)),
      })
      .perform<PermissionsResponseSchema>();
    return res.data;
  }

  async getMe(_params: GetMeParams) {
    const res = await super
      .sharedFindOne({ endpoint: endpoint.me })
      .perform<FindOneBackUserSchemaType>();
    return res.data;
  }

  async updateMe(params: UpdateMeParams) {
    const res = await super
      .sharedUpdate({
        endpoint: endpoint.updateMe,
        ...params,
      })
      .perform<UpdateBackUserSchemaType>();
    return res.data;
  }

  async changePasswordMe(params: ChangePasswordMeParams) {
    const res = await super
      .sharedChangePassword({
        endpoint: endpoint.changePasswordMe,
        ...params,
      })
      .perform<ChangePasswordTypeSchema>();
    return res.data;
  }

  async requestDeletionMe(_params: RequestDeletionMeParams) {
    const res = await this.axiosClient.post({ endpoint: endpoint.requestDeletionMe }).perform();
    return res.data;
  }
}
export { Client as UserFrontendClient };
