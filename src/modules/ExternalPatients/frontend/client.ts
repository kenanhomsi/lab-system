import { AxiosState } from "@/modules/axios";
import { injectable, injectFromBase } from "inversify";
import { ExternalPatientsClientBase } from "../abstraction/client";
import { endpoint } from "./endpoint";
import { parsePaginatedList } from "@/lib/api/bff-pagination";
import type { ExternalPatient } from "../backend/types";
import type {
  CreateExternalPatientFrontendParams,
  FindAllExternalPatientsFrontendParams,
  FindOneExternalPatientFrontendParams,
  LinkDirectPatientFrontendParams,
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
class Client extends ExternalPatientsClientBase<AxiosState> {
  async findAll(params?: FindAllExternalPatientsFrontendParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const query: Record<string, string> = {
      Page: String(page),
      PageSize: String(pageSize),
    };
    if (params?.search?.trim()) {
      query.Search = params.search.trim();
    }

    const res = await this.getEndpoint(appendQueryParams(endpoint.findAll, query)).perform<unknown>();
    return parsePaginatedList<ExternalPatient>(res.data, page, pageSize);
  }

  async create(params: CreateExternalPatientFrontendParams) {
    const res = await this.postJson(endpoint.create, params).perform<ExternalPatient>();
    return res.data;
  }

  async findOne(params: FindOneExternalPatientFrontendParams) {
    const { id } = params;
    const res = await this.getEndpoint(endpoint.findOne(id)).perform<ExternalPatient>();
    return res.data;
  }

  async linkDirectPatient(params: LinkDirectPatientFrontendParams) {
    const { id, directPatientUserId } = params;
    const res = await this.postJson(endpoint.linkDirectPatient(id), {
      directPatientUserId,
    }).perform();
    if (res.status !== 204) {
      throw new Error(`Link direct patient failed with status ${String(res.status)}`);
    }
  }
}

export { Client as ExternalPatientsFrontendClient };
