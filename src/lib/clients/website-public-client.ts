import { axiosInstanceFront } from "@/lib/clients/frontend-instance";

/** Public website helpers (browser) — all requests use axios `baseURL` `/api`. */

export async function getVacanciesPublic(): Promise<unknown> {
  const { data } = await axiosInstanceFront.get("/vacancies");
  return data;
}

export async function postCareersApplication(formData: FormData): Promise<void> {
  await axiosInstanceFront.post("/careers/apply", formData);
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
): Promise<void> {
  await axiosInstanceFront.post("/client-applications", body);
}

export async function getTestsCatalogPublic(
  params?: Record<string, string>,
): Promise<unknown> {
  const { data } = await axiosInstanceFront.get("/tests", {
    params: params ?? undefined,
  });
  return data;
}
