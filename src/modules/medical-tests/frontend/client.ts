import { injectable, injectFromBase } from "inversify";
import {
  MedicalTestClient,
  ShardFindOneTypeSchema,
  SharedCreateTypeSchema,
  SharedFindAllTypeSchema,
  SharedUpdateTypeSchema,
} from "../abstraction";
import { AxiosState } from "@/modules/axios";
import { endpoint } from "./endpoint";
import {
  DeleteMedicalTestParams,
  FindAllMedicalTestsParams,
  FindOneMedicalTestParams,
  CreateMedicalTestParams,
  UpdateMedicalTestParams,
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
class Client extends MedicalTestClient<AxiosState> {
  async findAll(params: FindAllMedicalTestsParams) {
    const res = await super
      .sharedFindAll({
        endpoint: appendQueryParams(endpoint.findAll, params.query),
      })
      .perform<SharedFindAllTypeSchema>();
    console.log("res frontend", res);
    return res.data;
  }

  async create(params: CreateMedicalTestParams) {
    const res = await super
      .sharedCreate({
        endpoint: endpoint.create,
        ...params,
      })
      .perform<SharedCreateTypeSchema>();
    return res.data;
  }

  async findOne(params: FindOneMedicalTestParams) {
    const { id } = params;
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(id) })
      .perform<ShardFindOneTypeSchema>();
    return res.data;
  }

  async update(params: UpdateMedicalTestParams) {
    const { id, ...body } = params;
    const res = await super
      .sharedUpdate({
        endpoint: endpoint.update(id),
        ...body,
      })
      .perform<SharedUpdateTypeSchema>();
    return res.data;
  }

  async delete(params: DeleteMedicalTestParams) {
    const { id } = params;
    const res = await super
      .sharedDelete({
        endpoint: endpoint.delete(id),
      })
      .perform();
    return res.data;
  }
}
export { Client as MedicalTestFrontendClient };
