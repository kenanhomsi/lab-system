import type { ExternalPatient } from "@/modules/ExternalPatients";

type ExternalPatientsPageData = {
  items: ExternalPatient[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type { ExternalPatient as ExternalPatientRow, ExternalPatientsPageData };
