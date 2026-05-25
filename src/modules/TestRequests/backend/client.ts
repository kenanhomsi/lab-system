import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
import { endpoint } from "./endpoint";
import { SharedCreateTypeSchema } from "../abstraction/schemas/create";
import { SharedUpdateTypeSchema } from "../abstraction/schemas/update";
import { ShardFindOneTypeSchema } from "../abstraction/schemas/find-one";
import { TestRequestClient } from "../abstraction";
import {
  CreateTestRequestParams,
  DeleteTestRequestParams,
  FindAllQueryParams,
  FindAllTestRequestParams,
  FindTestRequestParams,
  UpdateTestRequestParams,
} from "./types";
import { TestRequestsResponse } from "@/components/tables/test-requests-table/types";

const appendQueryParams = (
  path: string,
  query?: FindAllQueryParams,
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
class Client extends TestRequestClient<BackendState> {
  async findAll(params: FindAllTestRequestParams) {
    const { token, query } = params;
    const res = await super
      .sharedFindAll({
        endpoint: appendQueryParams(endpoint.findAll, query),
      })
      .withAuth(token)
      .perform<{
        success: boolean;
        message: string;
        data: TestRequestsResponse;
      }>();
    console.log("res backend", res.data);
    return res.data;
  }

  async create(params: CreateTestRequestParams) {
    const { token, ...body } = params;
    const res = await super
      .sharedCreate({ endpoint: endpoint.create, ...body })
      .withAuth(token)
      .perform<SharedCreateTypeSchema>();
    return res.data;
  }

  async findOne(params: FindTestRequestParams) {
    const { id, token } = params;
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(id) })
      .withAuth(token)
      .perform<ShardFindOneTypeSchema>();
    return res.data;
  }

  async update(params: UpdateTestRequestParams) {
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

  async delete(params: DeleteTestRequestParams) {
    const { id, token } = params;
    const res = await super
      .sharedDelete({ endpoint: endpoint.delete(id) })
      .withAuth(token)
      .perform();
    return res.data;
  }
}
export { Client as TestRequestBackendClient };
