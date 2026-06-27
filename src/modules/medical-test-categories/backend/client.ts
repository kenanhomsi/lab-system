import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
import {
  MedicalTestCategoriesResponse,
  MedicalTestCategory,
  MedicalTestCategoryClient,
} from "../abstraction";
import { endpoint } from "./endpoint";
import type {
  CreateMedicalTestCategoryParams,
  DeleteMedicalTestCategoryParams,
  GetMedicalTestCategoryParams,
  ListMedicalTestCategoriesParams,
  UpdateMedicalTestCategoryParams,
} from "./types";

const appendQueryParams = (
  path: string,
  query?: Record<string, string | number | boolean | undefined>,
): string => {
  if (!query) return path;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
};

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends MedicalTestCategoryClient<BackendState> {
  async list(params: ListMedicalTestCategoriesParams) {
    const { token, query } = params;
    const res = await super
      .sharedGet({ endpoint: appendQueryParams(endpoint.list, query) })
      .withAuth(token)
      .perform<MedicalTestCategoriesResponse>();
    return res.data;
  }

  async listAll(params: { token: string }) {
    const res = await super
      .sharedGet({ endpoint: endpoint.all })
      .withAuth(params.token)
      .perform<MedicalTestCategory[]>();
    return res.data;
  }

  async create(params: CreateMedicalTestCategoryParams) {
    const { token, ...body } = params;
    const res = await super
      .sharedPost({ endpoint: endpoint.list, body })
      .withAuth(token)
      .perform<MedicalTestCategory>();
    return res.data;
  }

  async get(params: GetMedicalTestCategoryParams) {
    const { token, id } = params;
    const res = await super
      .sharedGet({ endpoint: endpoint.byId(id) })
      .withAuth(token)
      .perform<MedicalTestCategory>();
    return res.data;
  }

  async update(params: UpdateMedicalTestCategoryParams) {
    const { token, id, ...body } = params;
    const res = await super
      .sharedPut({ endpoint: endpoint.byId(id), body })
      .withAuth(token)
      .perform<MedicalTestCategory>();
    return res.data;
  }

  async delete(params: DeleteMedicalTestCategoryParams) {
    const { token, id } = params;
    await super.sharedDelete({ endpoint: endpoint.byId(id) }).withAuth(token).perform();
  }
}

export { Client as MedicalTestCategoryBackendClient };
