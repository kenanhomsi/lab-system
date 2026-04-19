import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
import { RoleClient } from "../abstraction";
import { endpoint } from "./endpoint";
import {
  CreateRoleParams,
  DeleteRoleParams,
  FindAllRoleParams,
  FindOneRoleParams,
  UpdateRoleParams,
} from "./types";

type ListItem = {
  id: string;
  name: string;
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
class Client extends RoleClient<AxiosState> {
  async findAll(params: FindAllRoleParams) {
    const res = await super
      .sharedFindAll({ endpoint: appendQueryParams(endpoint.findAll, params.query) })
      .perform<ListResponse>();
    return res.data;
  }

  async create(params: CreateRoleParams) {
    const res = await super
      .sharedCreate({
        endpoint: endpoint.create,
        ...params,
      })
      .perform<ListItem>();
    return res.data;
  }

  async findOne(params: FindOneRoleParams) {
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(params.id) })
      .perform<ListItem>();
    return res.data;
  }

  async update(params: UpdateRoleParams) {
    const { id, ...body } = params;
    const res = await super
      .sharedUpdate({
        endpoint: endpoint.update(id),
        ...body,
      })
      .perform<ListItem>();
    return res.data;
  }

  async delete(params: DeleteRoleParams) {
    const res = await super
      .sharedDelete({ endpoint: endpoint.remove(params.id) })
      .perform<unknown>();
    return res.data;
  }
}

export { Client as RoleFrontendClient };
