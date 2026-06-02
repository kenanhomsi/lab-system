import { injectable, injectFromBase } from "inversify";
import {
  ShardFindOneTypeSchema,
  SharedCreateTypeSchema,
  SharedFindAllTypeSchema,
  SharedUpdateTypeSchema,
  VacantJobClient,
} from "../abstraction";
import { AxiosState } from "@/modules/axios";
import { endpoint } from "./endpoint";
import {
  CreateVacantJobParams,
  DeleteVacantJobParams,
  FindAllVacantJobsParams,
  FindOneVacantJobParams,
  UpdateVacantJobParams,
} from "./types";

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
class Client extends VacantJobClient<AxiosState> {
  async findAll(params: FindAllVacantJobsParams) {
    const res = await super
      .sharedFindAll({
        endpoint: appendQueryParams(endpoint.findAll, params.query),
      })
      .perform<SharedFindAllTypeSchema>();
    return res.data;
  }

  async create(params: CreateVacantJobParams) {
    const res = await super
      .sharedCreate({
        endpoint: endpoint.create,
        ...params,
      })
      .perform<SharedCreateTypeSchema>();
    return res.data;
  }

  async findOne(params: FindOneVacantJobParams) {
    const { id } = params;
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(id) })
      .perform<ShardFindOneTypeSchema>();
    return res.data;
  }

  async update(params: UpdateVacantJobParams) {
    const { id, ...body } = params;
    const res = await super
      .sharedUpdate({
        endpoint: endpoint.update(id),
        ...body,
      })
      .perform<SharedUpdateTypeSchema>();
    return res.data;
  }

  async delete(params: DeleteVacantJobParams) {
    const { id } = params;
    const res = await super
      .sharedDelete({
        endpoint: endpoint.delete(id),
      })
      .perform();
    return res.data;
  }
}

export { Client as VacantJobFrontendClient };
