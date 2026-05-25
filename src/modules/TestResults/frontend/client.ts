import { injectable, injectFromBase } from "inversify";
import {
  TestResultClient,
  ShardFindOneTypeSchema,
  SharedCreateTypeSchema,
  SharedUpdateTypeSchema,
} from "../abstraction";
import { AxiosState } from "@/modules/axios";
import { endpoint } from "./endpoint";
import {
  DeleteTestResultFrontendParams,
  FindAllTestResultsFrontendParams,
  FindOneTestResultFrontendParams,
  CreateTestResultFrontendParams,
  UpdateTestResultFrontendParams,
} from "./types";
import { TestResultsResponse } from "@/components/tables/test-results-table/types";

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
class Client extends TestResultClient<AxiosState> {
  async findAll(params: FindAllTestResultsFrontendParams) {
    const res = await super
      .sharedFindAll({
        endpoint: appendQueryParams(endpoint.findAll, params.query),
      })
      .perform<{
        success: boolean;
        message: string;
        data: TestResultsResponse;
      }>();
    return res.data;
  }

  async create(params: CreateTestResultFrontendParams) {
    const { testRequestId, resultDate, resultData, pdfUrl, status } = params;
    const res = await super
      .sharedCreate({
        endpoint: endpoint.create,
        testRequestId,
        resultDate,
        resultData,
        pdfUrl,
        status,
      })
      .perform<SharedCreateTypeSchema>();
    return res.data;
  }

  async findOne(params: FindOneTestResultFrontendParams) {
    const { id } = params;
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(id) })
      .perform<ShardFindOneTypeSchema>();
    return res.data;
  }

  async update(params: UpdateTestResultFrontendParams) {
    const { id, ...body } = params;
    const res = await super
      .sharedUpdate({
        endpoint: endpoint.update(id),
        ...body,
      })
      .perform<SharedUpdateTypeSchema>();
    return res.data;
  }

  async delete(params: DeleteTestResultFrontendParams) {
    const { id } = params;
    const res = await super
      .sharedDelete({
        endpoint: endpoint.delete(id),
      })
      .perform();
    return res.data;
  }
}
export { Client as TestResultFrontendClient };
