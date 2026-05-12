import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
import { endpoint } from "./endpoint";
import { SharedCreateTypeSchema } from "../abstraction/schemas/create";
import { SharedUpdateTypeSchema } from "../abstraction/schemas/update";
import { ShardFindOneTypeSchema } from "../abstraction/schemas/find-one";
import { TestResultClient } from "../abstraction";
import {
  CreateTestResultParams,
  DeleteTestResultParams,
  FindAllTestResultParams,
  FindTestResultParams,
  UpdateTestResultParams,
} from "./types";
import { TestResultItem } from "@/components/tables/test-results-table/types";

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

/** Upstream API expects `multipart/form-data` with PascalCase keys (OpenAPI / [FromForm]). */
function buildCreateTestResultFormData(params: {
  resultDate: string;
  resultData: string;
  pdfUrl: string;
  status: string;
}) {
  const fd = new FormData();
  fd.append("ResultDate", params.resultDate);
  fd.append("ResultData", params.resultData);
  fd.append("PdfUrl", params.pdfUrl);
  fd.append("Status", params.status);
  return fd;
}

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends TestResultClient<BackendState> {
  async findAll(params: FindAllTestResultParams) {
    const { token, query } = params;
    const res = await super
      .sharedFindAll({ endpoint: appendQueryParams(endpoint.findAll, query) })
      .withAuth(token)
      .perform <{data: TestResultItem[]}>();
    return res.data;
  }

  async create(params: CreateTestResultParams) {
    const { token, testRequestId, resultDate, resultData, pdfUrl, status } =
      params;
    const formData = buildCreateTestResultFormData({
      resultDate,
      resultData,
      pdfUrl,
      status,
    });
    const res = await this.axiosClient
      .post({ endpoint: endpoint.forTestRequest(testRequestId) })
      .setBody(formData)
      .withAuth(token)
      .perform<SharedCreateTypeSchema>();
    return res.data;
  }

  async findOne(params: FindTestResultParams) {
    const { id, token } = params;
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(id) })
      .withAuth(token)
      .perform<ShardFindOneTypeSchema>();
    return res.data;
  }

  async update(params: UpdateTestResultParams) {
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

  async delete(params: DeleteTestResultParams) {
    const { id, token } = params;
    const res = await super
      .sharedDelete({ endpoint: endpoint.delete(id) })
      .withAuth(token)
      .perform();
    return res.data;
  }
}
export { Client as TestResultBackendClient };
