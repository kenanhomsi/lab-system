import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
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

type ListResponse = ListItem[];

type RolePermissionItem = {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
};

type RolePermissionsResponse = RolePermissionItem[];

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
class Client extends RoleClient<AxiosState> {
  async findAll(params: FindAllRoleParams) {
    const res = await super
      .sharedFindAll({ endpoint: appendQueryParams(endpoint.findAll, params.query) })
      .perform<ListResponse>();
    return res;
  }

  async create(params: CreateRoleParams) {
    const res = await super
      .sharedCreate({
        endpoint: endpoint.create,
        ...params,
      })
      .perform<ListItem>();
    return res;
  }

  async findOne(params: FindOneRoleParams) {
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(params.id) })
      .perform<ListItem>();
    return res;
  }

  async update(params: UpdateRoleParams) {
    const { id, ...body } = params;
    const res = await super
      .sharedUpdate({
        endpoint: endpoint.update(id),
        ...body,
      })
      .perform<ListItem>();
    return res;
  }

  async delete(params: DeleteRoleParams) {
    const res = await super
      .sharedDelete({ endpoint: endpoint.remove(params.id) })
      .perform<unknown>();
    return res;
  }

  async getPermissions(params: GetRolePermissionsParams) {
    const res = await super
      .sharedGetPermissions({ endpoint: endpoint.permissions(params.id) })
      .perform<RolePermissionsResponse>();
    return res.data;
  }

  async assignPermission(params: AssignRolePermissionParams) {
    const { id, permissionId } = params;
    const res = await super
      .sharedAssignPermission({
        endpoint: endpoint.permissions(id),
        permissionId,
      })
      .perform<unknown>();
    return res.data;
  }

  async removePermission(params: RemoveRolePermissionParams) {
    const { id, permissionId } = params;
    const res = await super
      .sharedRemovePermission({
        endpoint: endpoint.removePermission(id, encodeURIComponent(permissionId)),
      })
      .perform<unknown>();
    return res.data;
  }
}

export { Client as RoleFrontendClient };
