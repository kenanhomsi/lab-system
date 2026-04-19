import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
import { ComplaintClient } from "../abstraction";
import { endpoint } from "./endpoint";
import { FindAllComplaintParams, UpdateComplaintStatusParams } from "./types";

type ComplaintItem = {
  id: number;
  userId: string;
  title: string;
  description: string;
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

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends ComplaintClient<AxiosState> {
  async findAll(params: FindAllComplaintParams) {
    const res = await super
      .sharedFindAll({ endpoint: appendQueryParams(endpoint.findAll, params.query) })
      .perform<ComplaintListResponse>();
    return res.data;
  }

  async updateStatus(params: UpdateComplaintStatusParams) {
    const { id, status } = params;
    const res = await super
      .sharedUpdateStatus({ endpoint: endpoint.updateStatus(id), status })
      .perform();
    return res.data;
  }
}

export { Client as ComplaintFrontendClient };
