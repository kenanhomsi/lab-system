import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
import { endpoint } from "./endpoint";
import { SharedCreateTypeSchema } from "../abstraction/schemas/create";
import { SharedUpdateTypeSchema } from "../abstraction/schemas/update";
import { ShardFindOneTypeSchema } from "../abstraction/schemas/find-one";
import { MedicalTestClient } from "../abstraction";
import {
  CreateUserParams,
  DeleteUserParams,
  FindAllPublicUserParams,
  FindAllUserParams,
  FindOnePublicUserParams,
  FindUserParams,
  UpdateUserParams,
} from "./types";
import { MedicalTestItem } from "@/components/tables/medical-tests-table/types";

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
class Client extends MedicalTestClient<BackendState> {
  async findAll(params: FindAllUserParams) {
    const { token, query } = params;
    const res = await super
      .sharedFindAll({ endpoint: appendQueryParams(endpoint.findAll, query) })
      .withAuth(token)
      .perform<{ data: MedicalTestItem[] }>();
    return res.data;
  }

  async findAllPublic(params: FindAllPublicUserParams) {
    const res = await super
      .sharedFindAll({ endpoint: appendQueryParams(endpoint.findAll, params.query) })
      .perform<unknown>();
    return res.data;
  }

  async findOnePublic(params: FindOnePublicUserParams) {
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(params.id) })
      .perform<unknown>();
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
}
export { Client as MedicalTestBackendClient };
