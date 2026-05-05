import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
import { RoleClient } from "../abstraction";
import { endpoint } from "./endpoint";
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

type ListItem = {
  id: string;
  name: string;
};

type FindAllRoleResponse = {
  success: boolean;
  message: string;
  data: ListItem[];
};

type RolePermissionItem = {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
};

type RolePermissionsResponse = {
  success: boolean;
  message: string;
  data: RolePermissionItem[];
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
class Client extends RoleClient<BackendState> {
  async findAll(params: FindAllRoleParams) {
    const res = await super
      .sharedFindAll({
        endpoint: appendQueryParams(endpoint.findAll, params.query),
      })
      .withAuth(params.token)
      .perform<FindAllRoleResponse>();
    return res.data.data;
  }

  async create(params: CreateRoleParams) {
    const { token, ...body } = params;
    const res = await super
      .sharedCreate({
        endpoint: endpoint.create,
        ...body,
      })
      .withAuth(token)
      .perform<ListItem>();
    return res.data;
  }

  async findOne(params: FindOneRoleParams) {
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(params.id) })
      .withAuth(params.token)
      .perform<ListItem>();
    return res.data;
  }

  async update(params: UpdateRoleParams) {
    const { id, token, ...body } = params;
    const res = await super
      .sharedUpdate({
        endpoint: endpoint.update(id),
        ...body,
      })
      .withAuth(token)
      .perform<ListItem>();
    return res.data;
  }

  async delete(params: DeleteRoleParams) {
    const res = await super
      .sharedDelete({ endpoint: endpoint.remove(params.id) })
      .withAuth(params.token)
      .perform<unknown>();
    return res.data;
  }

  async getPermissions(params: GetRolePermissionsParams) {
    const res = await super
      .sharedGetPermissions({ endpoint: endpoint.permissions(params.id) })
      .withAuth(params.token)
      .perform<RolePermissionsResponse>();
    return res.data.data;
  }

  async assignPermission(params: AssignRolePermissionParams) {
    const { id, token, permissionId } = params;
    const res = await super
      .sharedAssignPermission({
        endpoint: endpoint.permissions(id),
        permissionId,
      })
      .withAuth(token)
      .perform<unknown>();
    return res.data;
  }

  async removePermission(params: RemoveRolePermissionParams) {
    const { id, token, permissionId } = params;
    const res = await super
      .sharedRemovePermission({
        endpoint: endpoint.removePermission(id, encodeURIComponent(permissionId)),
      })
      .withAuth(token)
      .perform<unknown>();
    return res.data;
  }
}

export { Client as RoleBackendClient };
