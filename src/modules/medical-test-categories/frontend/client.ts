import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
import {
  MedicalTestCategoriesResponse,
  MedicalTestCategory,
  MedicalTestCategoryClient,
  UpsertMedicalTestCategoryInput,
} from "../abstraction";
import { endpoint } from "./endpoint";
import type {
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

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return numeric;
  }
  return fallback;
};

const normalizeCategory = (raw: unknown): MedicalTestCategory => {
  const record = asRecord(raw) ?? {};
  return {
    id: toNumber(record.id),
    nameAr: typeof record.nameAr === "string" ? record.nameAr : String(record.nameAr ?? ""),
    nameEn: typeof record.nameEn === "string" ? record.nameEn : String(record.nameEn ?? ""),
    description:
      typeof record.description === "string" ? record.description : String(record.description ?? ""),
    displayOrder: toNumber(record.displayOrder),
    isActive: typeof record.isActive === "boolean" ? record.isActive : Boolean(record.isActive ?? true),
    createdAt: typeof record.createdAt === "string" ? record.createdAt : String(record.createdAt ?? ""),
    updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : String(record.updatedAt ?? ""),
  };
};

const unwrap = (payload: unknown): unknown => {
  const record = asRecord(payload);
  return record && "data" in record ? record.data : payload;
};

const normalizeCategoriesResponse = (payload: unknown): MedicalTestCategoriesResponse => {
  const inner = unwrap(payload);
  const record = asRecord(inner);
  const rawItems = Array.isArray(inner) ? inner : Array.isArray(record?.items) ? record.items : [];
  const items = rawItems.map(normalizeCategory);
  const pageSize = toNumber(record?.pageSize, items.length || 20);
  const totalCount = toNumber(record?.totalCount, items.length);
  const page = toNumber(record?.page, 1);
  const totalPages = toNumber(record?.totalPages, Math.max(1, Math.ceil(totalCount / Math.max(pageSize, 1))));

  return {
    items,
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage:
      typeof record?.hasNextPage === "boolean" ? record.hasNextPage : page < totalPages,
    hasPreviousPage:
      typeof record?.hasPreviousPage === "boolean" ? record.hasPreviousPage : page > 1,
  };
};

const normalizeCategoriesList = (payload: unknown): MedicalTestCategory[] => {
  const inner = unwrap(payload);
  const record = asRecord(inner);
  const rawItems = Array.isArray(inner) ? inner : Array.isArray(record?.items) ? record.items : [];
  return rawItems.map(normalizeCategory);
};

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends MedicalTestCategoryClient<AxiosState> {
  async list(params?: ListMedicalTestCategoriesParams) {
    const res = await super
      .sharedGet({ endpoint: appendQueryParams(endpoint.list, params?.query) })
      .perform<unknown>();
    return normalizeCategoriesResponse(res.data);
  }

  async listAll() {
    const res = await super.sharedGet({ endpoint: endpoint.all }).perform<unknown>();
    return normalizeCategoriesList(res.data);
  }

  async create(body: UpsertMedicalTestCategoryInput) {
    const res = await super.sharedPost({ endpoint: endpoint.list, body }).perform<MedicalTestCategory>();
    return res.data;
  }

  async get(params: GetMedicalTestCategoryParams) {
    const res = await super.sharedGet({ endpoint: endpoint.byId(params.id) }).perform<MedicalTestCategory>();
    return res.data;
  }

  async update(params: UpdateMedicalTestCategoryParams) {
    const { id, ...body } = params;
    const res = await super.sharedPut({ endpoint: endpoint.byId(id), body }).perform<MedicalTestCategory>();
    return res.data;
  }

  async delete(id: number) {
    await super.sharedDelete({ endpoint: endpoint.byId(id) }).perform();
  }
}

export { Client as MedicalTestCategoryFrontendClient };
