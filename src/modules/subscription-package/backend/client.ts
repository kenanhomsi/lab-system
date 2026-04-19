import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
import { SubscriptionPackageClient } from "../abstraction";
import { endpoint } from "./endpoint";
import {
  ActivateSubscriptionPackageParams,
  CreateSubscriptionPackageParams,
  DeactivateSubscriptionPackageParams,
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

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends SubscriptionPackageClient<BackendState> {
  async findAll(params: FindAllSubscriptionPackageParams) {
    const res = await super
      .sharedFindAll({ endpoint: appendQueryParams(endpoint.findAll, params.query) })
      .withAuth(params.token)
      .perform<ListResponse>();
    return res.data;
  }

  async create(params: CreateSubscriptionPackageParams) {
    const { token, ...body } = params;
    const res = await super
      .sharedCreate({
        endpoint: endpoint.create,
        ...body,
      })
      .withAuth(token)
      .perform<ListItem>();
    return res.data;
  }

  async findOne(params: FindOneSubscriptionPackageParams) {
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(params.id) })
      .withAuth(params.token)
      .perform<ListItem>();
    return res.data;
  }

  async update(params: UpdateSubscriptionPackageParams) {
    const { id, token, ...body } = params;
    const res = await super
      .sharedUpdate({
        endpoint: endpoint.update(id),
        ...body,
      })
      .withAuth(token)
      .perform<ListItem>();
    return res.data;
  }

  async activate(params: ActivateSubscriptionPackageParams) {
    const res = await super
      .sharedActivate({ endpoint: endpoint.activate(params.id) })
      .withAuth(params.token)
      .perform<ListItem>();
    return res.data;
  }

  async deactivate(params: DeactivateSubscriptionPackageParams) {
    const res = await super
      .sharedDeactivate({ endpoint: endpoint.deactivate(params.id) })
      .withAuth(params.token)
      .perform<ListItem>();
    return res.data;
  }
}

export { Client as SubscriptionPackageBackendClient };
