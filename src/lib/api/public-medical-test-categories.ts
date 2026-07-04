import type {
  MedicalTestCategoriesResponse,
  MedicalTestCategory,
} from "@/modules/medical-test-categories";
import { getBackendBaseUrl, isUpstreamBackendReady } from "@/lib/api/bff-proxy";

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
  const isActive =
    typeof record.isActive === "boolean"
      ? record.isActive
      : typeof record.isActive === "string"
        ? record.isActive.trim().toLowerCase() === "true"
        : Boolean(record.isActive ?? true);
  return {
    id: toNumber(record.id),
    nameAr: typeof record.nameAr === "string" ? record.nameAr : String(record.nameAr ?? ""),
    nameEn: typeof record.nameEn === "string" ? record.nameEn : String(record.nameEn ?? ""),
    description:
      typeof record.description === "string" ? record.description : String(record.description ?? ""),
    displayOrder: toNumber(record.displayOrder),
    isActive,
    createdAt: typeof record.createdAt === "string" ? record.createdAt : String(record.createdAt ?? ""),
    updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : String(record.updatedAt ?? ""),
  };
};

const unwrapCategoriesPayload = (payload: unknown): unknown => {
  let current = payload;

  for (let depth = 0; depth < 4; depth += 1) {
    if (current === null || current === undefined) return current;
    if (Array.isArray(current)) return current;

    const record = asRecord(current);
    if (!record) return current;
    if (Array.isArray(record.items)) return record;

    if ("data" in record) {
      current = record.data;
      continue;
    }

    return record;
  }

  return current;
};

const buildUpstreamMedicalTestCategoriesHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  const token = process.env.BACKEND_PUBLIC_BEARER_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

type UpstreamMedicalTestCategoriesResult =
  | { ok: true; payload: unknown }
  | { ok: false; status: number; reason: "disabled" | "network" | "upstream" };

async function fetchUpstreamMedicalTestCategoriesList(
  query: Record<string, string>,
): Promise<UpstreamMedicalTestCategoriesResult> {
  if (!isUpstreamBackendReady()) {
    return { ok: false, status: 503, reason: "disabled" };
  }

  const url = new URL(`${getBackendBaseUrl()}/api/category-medical`);
  for (const [key, value] of Object.entries(query)) {
    if (value.trim()) url.searchParams.set(key, value);
  }

  try {
    const response = await fetch(url.toString(), {
      headers: buildUpstreamMedicalTestCategoriesHeaders(),
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return { ok: false, status: response.status, reason: "upstream" };
    }

    const payload = (await response.json()) as unknown;
    return { ok: true, payload };
  } catch {
    return { ok: false, status: 502, reason: "network" };
  }
}

const emptyMedicalTestCategoriesResponse = (
  pageSize: number,
): MedicalTestCategoriesResponse => ({
  items: [],
  page: 1,
  pageSize,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
});

function parsePublicMedicalTestCategoriesList(
  payload: unknown,
  pagination: { pageNumber: number; pageSize: number },
): MedicalTestCategoriesResponse {
  const inner = unwrapCategoriesPayload(payload);

  try {
    const record = asRecord(inner);
    const rawItems = Array.isArray(inner) ? inner : Array.isArray(record?.items) ? record.items : [];
    const items = rawItems.map(normalizeCategory).filter((category) => category.isActive);

    const pageSize =
      typeof record?.pageSize === "number" && Number.isFinite(record.pageSize)
        ? record.pageSize
        : pagination.pageSize;
    const totalCount =
      typeof record?.totalCount === "number" && Number.isFinite(record.totalCount)
        ? record.totalCount
        : items.length;
    const inferredTotalPages = Math.max(1, Math.ceil(totalCount / Math.max(pageSize, 1)));
    const page =
      typeof record?.page === "number" && Number.isFinite(record.page)
        ? record.page
        : pagination.pageNumber;
    const totalPages =
      typeof record?.totalPages === "number" && Number.isFinite(record.totalPages)
        ? record.totalPages
        : inferredTotalPages;

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
  } catch {
    return emptyMedicalTestCategoriesResponse(pagination.pageSize);
  }
}

export {
  emptyMedicalTestCategoriesResponse,
  fetchUpstreamMedicalTestCategoriesList,
  parsePublicMedicalTestCategoriesList,
};
