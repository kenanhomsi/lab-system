import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
import { SubscriptionPackageClient } from "../abstraction";
import { endpoint } from "./endpoint";
import {
  ActivateSubscriptionPackageParams,
  CreateSubscriptionPackageParams,
  DeactivateSubscriptionPackageParams,
  FindAllPublicSubscriptionPackageParams,
  FindAllSubscriptionPackageParams,
  FindOneSubscriptionPackageParams,
  UpdateSubscriptionPackageParams,
} from "./types";

type ListItem = {
  id: number;
  name: string;
  price: number;
  validityDays: number;
  includedTests: string;
  targetAudience: "All" | "Patient" | "Doctor" | "LabPartner";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type ListResponse = {
  items: ListItem[];
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
class Client extends SubscriptionPackageClient<BackendState> {
  async findAll(params: FindAllSubscriptionPackageParams) {
    const res = await super
      .sharedFindAll({
        endpoint: appendQueryParams(endpoint.findAll, params.query),
      })
      .withAuth(params.token)
      .perform<unknown>();
    return unwrapResponse<ListResponse>(res.data);
  }

  async findAllPublic(params: FindAllPublicSubscriptionPackageParams) {
    const res = await super
      .sharedFindAll({
        endpoint: appendQueryParams(endpoint.findAll, params.query),
      })
      .perform<unknown>();
    return unwrapResponse<ListResponse>(res.data);
  }

  async create(params: CreateSubscriptionPackageParams) {
    const { token, ...body } = params;
    const res = await super
      .sharedCreate({
        endpoint: endpoint.create,
        ...body,
      })
      .withAuth(token)
      .perform<unknown>();
    return unwrapResponse<ListItem>(res.data);
  }

  async findOne(params: FindOneSubscriptionPackageParams) {
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(params.id) })
      .withAuth(params.token)
      .perform<unknown>();
    return unwrapResponse<ListItem>(res.data);
  }

  async update(params: UpdateSubscriptionPackageParams) {
    const { id, token, ...body } = params;
    const res = await super
      .sharedUpdate({
        endpoint: endpoint.update(id),
        ...body,
      })
      .withAuth(token)
      .perform<unknown>();
    return unwrapResponse<ListItem>(res.data);
  }

  async activate(params: ActivateSubscriptionPackageParams) {
    const res = await super
      .sharedActivate({ endpoint: endpoint.activate(params.id) })
      .withAuth(params.token)
      .perform<unknown>();
    return unwrapResponse<ListItem>(res.data);
  }

  async deactivate(params: DeactivateSubscriptionPackageParams) {
    const res = await super
      .sharedDeactivate({ endpoint: endpoint.deactivate(params.id) })
      .withAuth(params.token)
      .perform<unknown>();
    return unwrapResponse<ListItem>(res.data);
  }
}

export { Client as SubscriptionPackageBackendClient };
