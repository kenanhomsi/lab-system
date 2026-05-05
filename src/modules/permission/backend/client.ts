import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
import { PermissionClient } from "../abstraction";
import { endpoint } from "./endpoint";
import {
  CreatePermissionParams,
  DeletePermissionParams,
  FindAllPermissionParams,
  FindOnePermissionParams,
  UpdatePermissionParams,
} from "./types";

type ListItem = {
  id: string;
  name: string;
  description: string;
};

type ListResponse = ListItem[];

type getAllResponseType = {
  success: boolean;
  message: string;
  data: ListResponse;
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
class Client extends PermissionClient<BackendState> {
  async findAll(params: FindAllPermissionParams) {
    const res = await super
      .sharedFindAll({
        endpoint: appendQueryParams(endpoint.findAll, params.query),
      })
      .withAuth(params.token)
      .perform<getAllResponseType>();
    return res.data.data;
  }

  async create(params: CreatePermissionParams) {
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

  async findOne(params: FindOnePermissionParams) {
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(params.id) })
      .withAuth(params.token)
      .perform<ListItem>();
    return res.data;
  }

  async update(params: UpdatePermissionParams) {
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

  async delete(params: DeletePermissionParams) {
    const res = await super
      .sharedDelete({ endpoint: endpoint.remove(params.id) })
      .withAuth(params.token)
      .perform<unknown>();
    return res.data;
  }
}

export { Client as PermissionBackendClient };
