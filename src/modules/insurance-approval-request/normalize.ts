import type {
  InsuranceApprovalRequestDetail,
  InsuranceApprovalRequestItem,
  InsuranceApprovalRequestsListResponse,
} from "./types";

type InsuranceApprovalRecord = Record<string, unknown>;

const readString = (
  source: InsuranceApprovalRecord,
  keys: readonly string[],
): string | null => {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }
  return null;
};

const isRecord = (value: unknown): value is InsuranceApprovalRecord =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const normalizeItem = (item: InsuranceApprovalRequestItem): InsuranceApprovalRequestItem => {
  const source = item as InsuranceApprovalRecord;
  return {
    ...item,
    insuranceCardImageUrl: readString(source, [
      "insuranceCardImageUrl",
      "InsuranceCardImageUrl",
      "insuranceCardImage",
      "InsuranceCardImage",
      "insuranceCardUrl",
      "InsuranceCardUrl",
    ]),
    insuranceCardOriginalFileName: readString(source, [
      "insuranceCardOriginalFileName",
      "InsuranceCardOriginalFileName",
      "insuranceCardFileName",
      "InsuranceCardFileName",
    ]),
    prescriptionImageUrl: readString(source, [
      "prescriptionImageUrl",
      "PrescriptionImageUrl",
      "prescriptionImage",
      "PrescriptionImage",
      "prescriptionUrl",
      "PrescriptionUrl",
    ]),
    prescriptionOriginalFileName: readString(source, [
      "prescriptionOriginalFileName",
      "PrescriptionOriginalFileName",
      "prescriptionFileName",
      "PrescriptionFileName",
    ]),
  };
};

const normalizeListResponse = (
  response: InsuranceApprovalRequestsListResponse,
): InsuranceApprovalRequestsListResponse => ({
  ...response,
  items: Array.isArray(response.items) ? response.items.map(normalizeItem) : [],
});

const normalizeDetail = (
  response: InsuranceApprovalRequestDetail,
): InsuranceApprovalRequestDetail => {
  const normalized = normalizeItem(response);
  return {
    ...response,
    insuranceCardImageUrl: normalized.insuranceCardImageUrl ?? null,
    insuranceCardOriginalFileName: normalized.insuranceCardOriginalFileName ?? null,
    prescriptionImageUrl: normalized.prescriptionImageUrl ?? null,
    prescriptionOriginalFileName: normalized.prescriptionOriginalFileName ?? null,
  };
};

const unwrapResponse = <T>(response: unknown): T => {
  if (isRecord(response) && "data" in response) {
    return response.data as T;
  }
  return response as T;
};

export {
  normalizeDetail,
  normalizeListResponse,
  unwrapResponse,
};
