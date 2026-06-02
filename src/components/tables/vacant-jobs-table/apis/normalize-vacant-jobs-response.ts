import type { VacantJobItem, VacantJobsResponse } from "../types";

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

const normalizeVacantJobItem = (raw: unknown): VacantJobItem => {
  const r = asRecord(raw) ?? {};
  const rawId = r.id ?? r["Id"];
  return {
    id: coerceNumericId(rawId),
    titleAr: typeof r.titleAr === "string" ? r.titleAr : String(r.titleAr ?? ""),
    titleEn: typeof r.titleEn === "string" ? r.titleEn : String(r.titleEn ?? ""),
    descriptionAr:
      typeof r.descriptionAr === "string" ? r.descriptionAr : String(r.descriptionAr ?? ""),
    descriptionEn:
      typeof r.descriptionEn === "string" ? r.descriptionEn : String(r.descriptionEn ?? ""),
    isActive: Boolean(r.isActive),
    sortOrder:
      typeof r.sortOrder === "number" && Number.isFinite(r.sortOrder) ? r.sortOrder : 0,
    createdAt: typeof r.createdAt === "string" ? r.createdAt : String(r.createdAt ?? ""),
    updatedAt: typeof r.updatedAt === "string" ? r.updatedAt : String(r.updatedAt ?? ""),
  };
};

type PaginationParams = {
  pageNumber: number;
  pageSize: number;
};

const normalizePagedResponse = (
  obj: Record<string, unknown>,
  pagination: PaginationParams,
): VacantJobsResponse => {
  const itemsRaw = obj.items;
  if (!Array.isArray(itemsRaw)) {
    throw new Error("Failed to fetch vacant jobs");
  }

  const items = itemsRaw.map(normalizeVacantJobItem);

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

  const hasNextFlag = typeof obj.hasNextPage === "boolean" ? obj.hasNextPage : undefined;
  const hasPrevFlag = typeof obj.hasPreviousPage === "boolean" ? obj.hasPreviousPage : undefined;

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

function unwrapVacantJobsInner(payload: unknown): unknown {
  if (payload === null || typeof payload !== "object") {
    return payload;
  }
  const record = payload as Record<string, unknown>;
  if (record.data !== null && typeof record.data === "object") {
    return record.data;
  }
  return payload;
}

function normalizeVacantJobsResponse(
  inner: unknown,
  pagination: PaginationParams,
): VacantJobsResponse {
  const unwrapped = unwrapVacantJobsInner(inner);

  if (unwrapped === undefined || unwrapped === null) {
    throw new Error("Failed to fetch vacant jobs");
  }

  if (Array.isArray(unwrapped)) {
    const items = unwrapped.map(normalizeVacantJobItem);
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
  }

  const obj = asRecord(unwrapped);
  if (obj && Array.isArray(obj.items)) {
    return normalizePagedResponse(obj, pagination);
  }

  throw new Error("Failed to fetch vacant jobs");
}

export { normalizeVacantJobItem, normalizeVacantJobsResponse };
