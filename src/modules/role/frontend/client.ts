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

type RoleAccessPolicyItem = {
  id: string;
  resource: string;
  action: string;
  effect: string;
  subjectType: string;
  subjectKey: string;
  priority: number;
  isEnabled: boolean;
  description: string | null;
  validFrom: string | null;
  validTo: string | null;
};

type ListItem = {
  id: string;
  name: string;
};

export type RoleItem = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items: {
    id: string;
    name: string;
    accessPolicies: RoleAccessPolicyItem[];
  }[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
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
class Client extends RoleClient<AxiosState> {
  async findAll(params: FindAllRoleParams) {
    const res = await super
      .sharedFindAll({
        endpoint: appendQueryParams(endpoint.findAll, params.query),
      })
      .perform<RoleItem>();
    return res.data;
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
}

export { Client as RoleFrontendClient };
