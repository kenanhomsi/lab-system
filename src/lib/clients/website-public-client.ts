import { axiosInstanceFront } from "@/lib/clients/frontend-instance";
import type { Vacancy } from "@/types/career";

/** Public website helpers (browser) — all requests use axios `baseURL` `/api`. */

function parseVacanciesPayload(data: unknown): Vacancy[] {
  if (Array.isArray(data)) {
    return data as Vacancy[];
  }

  const record = data as Record<string, unknown> | null;
  if (!record) return [];

  /* Upstream: `{ success, message, data: { items: [...] } }` or `{ data: { items } }` */
  const nested = record.data;
  if (nested !== null && typeof nested === "object") {
    const inner = nested as Record<string, unknown>;
    if (Array.isArray(inner.items)) {
      return inner.items as Vacancy[];
    }
  }

  if (Array.isArray(record.items)) {
    return record.items as Vacancy[];
  }

  return [];
}

export async function getVacanciesPublic(): Promise<Vacancy[]> {
  const { data } = await axiosInstanceFront.get("/vacancies");
  const items = parseVacanciesPayload(data);
  return items
    .filter((job) => job.isActive !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export async function postCareersApplication(formData: FormData): Promise<void> {
  await axiosInstanceFront.post("/employment-applications", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function postComplaintPublic(formData: FormData): Promise<void> {
  await axiosInstanceFront.post("/complaints", formData);
}

export async function getContactSettingsPublic(): Promise<Record<string, unknown>> {
  const { data } = await axiosInstanceFront.get<Record<string, unknown>>(
    "/settings/contact",
  );
  return data ?? {};
}

export async function postContactPublic(
  body: Record<string, FormDataEntryValue>,
): Promise<void> {
  await axiosInstanceFront.post("/contact", body);
}

export async function postClientApplicationPublic(
  body: Record<string, FormDataEntryValue>,
): Promise<string> {
  const payload = {
    managerName: String(body.managerName ?? ""),
    labName: String(body.labName ?? ""),
    mobileNumber: String(body.mobileNumber ?? ""),
    email: String(body.email ?? ""),
    address: String(body.address ?? ""),
    additionalInfo: String(body.additionalInfo ?? ""),
  };
  const { data } = await axiosInstanceFront.post<{
    success?: boolean;
    data?: { message?: string };
    message?: string;
  }>("/client-join-requests", payload);
  return data?.data?.message ?? data?.message ?? "";
}

export async function postContractServiceRequestPublic(
  body: Record<string, FormDataEntryValue>,
): Promise<string> {
  const payload = {
    contractType: String(body.contractType ?? ""),
    responsibleName: String(body.responsibleName ?? ""),
    organizationName: String(body.organizationName ?? ""),
    expectedSubscribersCount: Number(body.expectedSubscribersCount ?? 0),
    contactNumber: String(body.contactNumber ?? ""),
    email: String(body.email ?? ""),
    address: String(body.address ?? ""),
    contractDuration: String(body.contractDuration ?? ""),
    additionalInfo: String(body.additionalInfo ?? ""),
  };
  const { data } = await axiosInstanceFront.post<{
    success?: boolean;
    data?: { message?: string };
    message?: string;
  }>("/contract-service-requests", payload);
  return data?.data?.message ?? data?.message ?? "";
}

export async function getTestsCatalogPublic(
  params?: Record<string, string>,
): Promise<unknown> {
  const { data } = await axiosInstanceFront.get("/tests", {
    params: params ?? undefined,
  });
  return data;
}
