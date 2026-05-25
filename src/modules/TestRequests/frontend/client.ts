import { injectable, injectFromBase } from "inversify";
import {
  TestRequestClient,
  ShardFindOneTypeSchema,
  SharedCreateTypeSchema,
  SharedUpdateTypeSchema,
} from "../abstraction";
import { AxiosState } from "@/modules/axios";
import { endpoint } from "./endpoint";
import {
  DeleteTestRequestFrontendParams,
  FindAllTestRequestsFrontendParams,
  FindOneTestRequestFrontendParams,
  CreateTestRequestFrontendParams,
  UpdateTestRequestFrontendParams,
} from "./types";
import { TestRequestsResponse } from "@/components/tables/test-requests-table/types";

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
class Client extends TestRequestClient<AxiosState> {
  async findAll(params: FindAllTestRequestsFrontendParams) {
    const res = await super
      .sharedFindAll({
        endpoint: appendQueryParams(endpoint.findAll, params.query),
      })
      .perform<{
        success: boolean;
        message: string;
        data: TestRequestsResponse;
      }>();
    console.log("res frontend", res.data);
    return res.data;
  }

  async create(params: CreateTestRequestFrontendParams) {
    const res = await super
      .sharedCreate({
        endpoint: endpoint.create,
        ...params,
      })
      .perform<SharedCreateTypeSchema>();
    return res.data;
  }

  async findOne(params: FindOneTestRequestFrontendParams) {
    const { id } = params;
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(id) })
      .perform<ShardFindOneTypeSchema>();
    return res.data;
  }

  async update(params: UpdateTestRequestFrontendParams) {
    const { id, ...body } = params;
    const res = await super
      .sharedUpdate({
        endpoint: endpoint.update(id),
        ...body,
      })
      .perform<SharedUpdateTypeSchema>();
    return res.data;
  }

  async delete(params: DeleteTestRequestFrontendParams) {
    const { id } = params;
    const res = await super
      .sharedDelete({
        endpoint: endpoint.delete(id),
      })
      .perform();
    return res.data;
  }
}
export { Client as TestRequestFrontendClient };
