import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
import { ComplaintClient } from "../abstraction";
import { endpoint } from "./endpoint";
import {
  CreateMineComplaintParams,
  FindAllComplaintParams,
  FindMineComplaintParams,
  UpdateComplaintStatusParams,
} from "./types";

type ComplaintItem = {
  id: number;
  userId: string;
  title: string;
  description: string;
  note: string;
  attachmentUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type ComplaintListResponse = {
  items: ComplaintItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
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

const unwrapResponse = <T>(response: unknown): T => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as Record<string, unknown>).data as T;
  }
  return response as T;
};

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends ComplaintClient<BackendState> {
  async findAll(params: FindAllComplaintParams) {
    const res = await super
      .sharedFindAll({ endpoint: appendQueryParams(endpoint.findAll, params.query) })
      .withAuth(params.token)
      .perform<unknown>();
    return unwrapResponse<ComplaintListResponse>(res.data);
  }

  async updateStatus(params: UpdateComplaintStatusParams) {
    const { id, token, status } = params;
    const res = await super
      .sharedUpdateStatus({ endpoint: endpoint.updateStatus(id), status })
      .withAuth(token)
      .perform();
    return unwrapResponse(res.data);
  }

  async findMine(params: FindMineComplaintParams) {
    const res = await super
      .sharedFindAll({
        endpoint: appendQueryParams(endpoint.findMine, params.query),
      })
      .withAuth(params.token)
      .perform<unknown>();
    return unwrapResponse<unknown>(res.data);
  }

  async createMine(params: CreateMineComplaintParams) {
    const res = await super
      .sharedPostFormData({
        endpoint: endpoint.createMine,
        formData: params.formData,
      })
      .withAuth(params.token)
      .perform<unknown>();
    return {
      data: unwrapResponse<unknown>(res.data),
      status: res.status,
    };
  }
}

export { Client as ComplaintBackendClient };
