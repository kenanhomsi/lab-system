import type { ParameterSchemaInput } from "@/modules/medical-tests/abstraction";
import type { MedicalTestItem, MedicalTestsResponse } from "../types";

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;

const coerceNumericId = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return -1;
};

const coercePrice = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return 0;
};

const coerceParameterSchema = (value: unknown): ParameterSchemaInput => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value as ParameterSchemaInput;
  const flat = asRecord(value);
  if (flat) return flat as ParameterSchemaInput;
  return "{}";
};

const normalizeMedicalTestItem = (raw: unknown): MedicalTestItem => {
  const r = asRecord(raw) ?? {};
  /* Some backends serialize primary keys as `Id` instead of camelCase `id`. */
  const rawId = r.id ?? r["Id"];
  return {
    id: coerceNumericId(rawId),
    nameAr: typeof r.nameAr === "string" ? r.nameAr : String(r.nameAr ?? ""),
    nameEn: typeof r.nameEn === "string" ? r.nameEn : String(r.nameEn ?? ""),
    price: coercePrice(r.price),
    category: typeof r.category === "string" ? r.category : String(r.category ?? ""),
    sampleType: typeof r.sampleType === "string" ? r.sampleType : String(r.sampleType ?? ""),
    parameterSchema: coerceParameterSchema(r.parameterSchema),
    status: typeof r.status === "string" ? r.status : String(r.status ?? ""),
    createdByUserId:
      typeof r.createdByUserId === "string"
        ? r.createdByUserId
        : r.createdByUserId != null
          ? String(r.createdByUserId)
          : "",
    createdAt: typeof r.createdAt === "string" ? r.createdAt : String(r.createdAt ?? ""),
    updatedAt:
      r.updatedAt == null ? "" : typeof r.updatedAt === "string" ? r.updatedAt : String(r.updatedAt),
  };
};

type PaginationParams = {
  pageNumber: number;
  pageSize: number;
};

const normalizeArrayResponse = (
  rawItems: unknown[],
  pagination: PaginationParams,
): MedicalTestsResponse => {
  const items = rawItems.map(normalizeMedicalTestItem);
  const { pageNumber, pageSize } = pagination;
  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(pageSize, 1)));
  const safePage = Math.min(Math.max(pageNumber, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
  };
};

const normalizePagedResponse = (
  obj: Record<string, unknown>,
  pagination: PaginationParams,
): MedicalTestsResponse => {
  const itemsRaw = obj.items;
  if (!Array.isArray(itemsRaw)) {
    throw new Error("Failed to fetch medical tests");
  }

  const items = itemsRaw.map(normalizeMedicalTestItem);

  const pageSize =
    typeof obj.pageSize === "number" && Number.isFinite(obj.pageSize)
      ? obj.pageSize
      : pagination.pageSize;

  const totalCount =
    typeof obj.totalCount === "number" && Number.isFinite(obj.totalCount)
      ? obj.totalCount
      : items.length;

  const inferredTotalPages = Math.max(1, Math.ceil(totalCount / Math.max(pageSize, 1)));

  const page =
    typeof obj.page === "number" && Number.isFinite(obj.page) ? obj.page : pagination.pageNumber;

  const totalPages =
    typeof obj.totalPages === "number" && Number.isFinite(obj.totalPages)
      ? obj.totalPages
      : inferredTotalPages;

  const hasNextFlag =
    typeof obj.hasNextPage === "boolean" ? obj.hasNextPage : undefined;
  const hasPrevFlag =
    typeof obj.hasPreviousPage === "boolean" ? obj.hasPreviousPage : undefined;

  return {
    items,
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: hasNextFlag ?? page < totalPages,
    hasPreviousPage: hasPrevFlag ?? page > 1,
  };
};

function normalizeMedicalTestsResponse(
  inner: unknown,
  pagination: PaginationParams,
): MedicalTestsResponse {
  if (inner === undefined || inner === null) {
    throw new Error("Failed to fetch medical tests");
  }

  if (Array.isArray(inner)) {
    return normalizeArrayResponse(inner, pagination);
  }

  const obj = asRecord(inner);
  if (obj && Array.isArray(obj.items)) {
    return normalizePagedResponse(obj, pagination);
  }

  throw new Error("Failed to fetch medical tests");
}

export { normalizeMedicalTestItem, normalizeMedicalTestsResponse };
