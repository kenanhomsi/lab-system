import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
import { InsuranceApprovalRequestClient } from "../abstraction";
import {
  CreateInsuranceApprovalMessageResponse,
  InsuranceApprovalRequestDetail,
  InsuranceApprovalRequestsListResponse,
} from "../types";
import { endpoint } from "./endpoint";
import {
  CreateInsuranceApprovalParams,
  FindAllInsuranceApprovalParams,
  FindMineInsuranceApprovalParams,
  FindOneInsuranceApprovalParams,
  RemoveInsuranceApprovalParams,
  UpdateInsuranceApprovalStatusParams,
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

const unwrapResponse = <T>(response: unknown): T => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as Record<string, unknown>).data as T;
  }
  return response as T;
};

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends InsuranceApprovalRequestClient<BackendState> {
  async findAll(params: FindAllInsuranceApprovalParams) {
    const res = await super
      .sharedFindAll({
        endpoint: appendQueryParams(endpoint.findAll, params.query),
      })
      .withAuth(params.token)
      .perform<unknown>();
    return unwrapResponse<InsuranceApprovalRequestsListResponse>(res.data);
  }

  async findMine(params: FindMineInsuranceApprovalParams) {
    const res = await super
      .sharedFindAll({
        endpoint: appendQueryParams(endpoint.findMine, params.query),
      })
      .withAuth(params.token)
      .perform<unknown>();
    return unwrapResponse<InsuranceApprovalRequestsListResponse>(res.data);
  }

  async findMineOne(params: FindOneInsuranceApprovalParams) {
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findMineOne(params.id) })
      .withAuth(params.token)
      .perform<unknown>();
    return unwrapResponse<InsuranceApprovalRequestDetail>(res.data);
  }

  async findOne(params: FindOneInsuranceApprovalParams) {
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(params.id) })
      .withAuth(params.token)
      .perform<unknown>();
    return unwrapResponse<InsuranceApprovalRequestDetail>(res.data);
  }

  async create(params: CreateInsuranceApprovalParams) {
    const res = await super
      .sharedPostFormData({
        endpoint: endpoint.create,
        formData: params.formData,
      })
      .withAuth(params.token)
      .perform<unknown>();
    return {
      data: unwrapResponse<CreateInsuranceApprovalMessageResponse>(res.data),
      status: res.status,
    };
  }

  async updateStatus(params: UpdateInsuranceApprovalStatusParams) {
    const { id, token, status, notes, rejectionReason } = params;
    const res = await super
      .sharedUpdateStatus({
        endpoint: endpoint.updateStatus(id),
        status,
        notes,
        rejectionReason,
      })
      .withAuth(token)
      .perform<unknown>();
    return unwrapResponse(res.data);
  }

  async remove(params: RemoveInsuranceApprovalParams) {
    await super
      .sharedDelete({ endpoint: endpoint.remove(params.id) })
      .withAuth(params.token)
      .perform();
  }
}

export { Client as InsuranceApprovalRequestBackendClient };
