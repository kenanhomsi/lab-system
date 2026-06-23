import type { MedicalTestItem, MedicalTestsResponse } from "@/components/tables/medical-tests-table/types";
import {
  normalizeMedicalTestItem,
  normalizeMedicalTestsResponse,
} from "@/components/tables/medical-tests-table/apis/normalize-medical-tests-response";
import { getBackendBaseUrl, isUpstreamBackendReady } from "@/lib/api/bff-proxy";

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;

const isActiveMedicalTest = (item: MedicalTestItem): boolean =>
  item.status.trim().toLowerCase() === "active";

const unwrapMedicalTestsPayload = (payload: unknown): unknown => {
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

const buildUpstreamMedicalTestsHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  const token = process.env.BACKEND_PUBLIC_BEARER_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

type UpstreamMedicalTestsResult =
  | { ok: true; payload: unknown }
  | { ok: false; status: number; reason: "disabled" | "network" | "upstream" };

async function fetchUpstreamMedicalTestsList(
  query: Record<string, string>,
): Promise<UpstreamMedicalTestsResult> {
  if (!isUpstreamBackendReady()) {
    return { ok: false, status: 503, reason: "disabled" };
  }

  const url = new URL(`${getBackendBaseUrl()}/api/medical-tests`);
  for (const [key, value] of Object.entries(query)) {
    if (value.trim()) url.searchParams.set(key, value);
  }

  try {
    const response = await fetch(url.toString(), {
      headers: buildUpstreamMedicalTestsHeaders(),
      cache: "no-store",
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

async function fetchUpstreamMedicalTestDetail(id: string): Promise<UpstreamMedicalTestsResult> {
  if (!isUpstreamBackendReady()) {
    return { ok: false, status: 503, reason: "disabled" };
  }

  const url = `${getBackendBaseUrl()}/api/medical-tests/${encodeURIComponent(id)}`;

  try {
    const response = await fetch(url, {
      headers: buildUpstreamMedicalTestsHeaders(),
      cache: "no-store",
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

const emptyMedicalTestsResponse = (pageSize: number): MedicalTestsResponse => ({
  items: [],
  page: 1,
  pageSize,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
});

function parsePublicMedicalTestsList(
  payload: unknown,
  pagination: { pageNumber: number; pageSize: number },
): MedicalTestsResponse {
  const inner = unwrapMedicalTestsPayload(payload);

  try {
    const normalized = normalizeMedicalTestsResponse(inner, pagination);
    const items = normalized.items.filter(isActiveMedicalTest);
    return { ...normalized, items };
  } catch {
    return emptyMedicalTestsResponse(pagination.pageSize);
  }
}

function parsePublicMedicalTestDetail(payload: unknown): MedicalTestItem | null {
  const inner = unwrapMedicalTestsPayload(payload);
  if (!inner || typeof inner !== "object") return null;

  const item = normalizeMedicalTestItem(inner);
  return isActiveMedicalTest(item) ? item : null;
}

export {
  emptyMedicalTestsResponse,
  fetchUpstreamMedicalTestDetail,
  fetchUpstreamMedicalTestsList,
  parsePublicMedicalTestDetail,
  parsePublicMedicalTestsList,
};
