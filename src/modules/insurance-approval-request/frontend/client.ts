import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
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
class Client extends InsuranceApprovalRequestClient<AxiosState> {
  async findAll(params: FindAllInsuranceApprovalParams) {
    const res = await super
      .sharedFindAll({ endpoint: appendQueryParams(endpoint.findAll, params.query) })
      .perform<unknown>();
    return unwrapResponse<InsuranceApprovalRequestsListResponse>(res.data);
  }

  async findMine(params: FindMineInsuranceApprovalParams) {
    const res = await super
      .sharedFindAll({ endpoint: appendQueryParams(endpoint.findMine, params.query) })
      .perform<unknown>();
    return unwrapResponse<InsuranceApprovalRequestsListResponse>(res.data);
  }

  async findMineOne(id: string) {
    const res = await super.sharedFindOne({ endpoint: endpoint.findMineOne(id) }).perform<unknown>();
    return unwrapResponse<InsuranceApprovalRequestDetail>(res.data);
  }

  async findOne(id: string) {
    const res = await super.sharedFindOne({ endpoint: endpoint.findOne(id) }).perform<unknown>();
    return unwrapResponse<InsuranceApprovalRequestDetail>(res.data);
  }

  async create(params: CreateInsuranceApprovalParams) {
    const formData = new FormData();
    formData.append("InsuredName", params.insuredName);
    formData.append("InsuranceNumber", params.insuranceNumber);
    formData.append("MobileNumber", params.mobileNumber);
    formData.append("InsuranceCardImage", params.insuranceCardImage);
    formData.append("PrescriptionImage", params.prescriptionImage);
    const res = await super
      .sharedPostFormData({ endpoint: endpoint.create, formData })
      .perform<unknown>();
    return unwrapResponse<CreateInsuranceApprovalMessageResponse>(res.data);
  }

  async updateStatus(params: UpdateInsuranceApprovalStatusParams) {
    const { id, status, notes, rejectionReason } = params;
    const res = await super
      .sharedUpdateStatus({
        endpoint: endpoint.updateStatus(id),
        status,
        notes,
        rejectionReason,
      })
      .perform<unknown>();
    return unwrapResponse(res.data);
  }

  async remove(id: string) {
    await super.sharedDelete({ endpoint: endpoint.remove(id) }).perform();
  }
}

export { Client as InsuranceApprovalRequestFrontendClient };
