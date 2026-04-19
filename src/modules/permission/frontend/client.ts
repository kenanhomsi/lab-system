import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
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
class Client extends PermissionClient<AxiosState> {
  async findAll(params: FindAllPermissionParams) {
    const res = await super
      .sharedFindAll({ endpoint: appendQueryParams(endpoint.findAll, params.query) })
      .perform<ListResponse>();
    return res.data;
  }

  async create(params: CreatePermissionParams) {
    const res = await super
      .sharedCreate({
        endpoint: endpoint.create,
        ...params,
      })
      .perform<ListItem>();
    return res.data;
  }

  async findOne(params: FindOnePermissionParams) {
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(params.id) })
      .perform<ListItem>();
    return res.data;
  }

  async update(params: UpdatePermissionParams) {
    const { id, ...body } = params;
    const res = await super
      .sharedUpdate({
        endpoint: endpoint.update(id),
        ...body,
      })
      .perform<ListItem>();
    return res.data;
  }

  async delete(params: DeletePermissionParams) {
    const res = await super
      .sharedDelete({ endpoint: endpoint.remove(params.id) })
      .perform<unknown>();
    return res.data;
  }
}

export { Client as PermissionFrontendClient };
