export type TestRequestTestItem = {
  testRequestId: number;
  medicalTestId: number;
  medicalTestNameEn?: string | null;
  parameterSchema?: string | null;
  parameters?: unknown[];
};

export type TestRequestItem = {
  id: number;
  medicalTestId?: number;
  testRequestIds?: number[];
  tests?: TestRequestTestItem[];
  medicalTestNameEn?: string | null;
  externalPatientFullName?: string | null;
  requestDate: string;
  status: string;
  totalAmount: number;
  notes: string | null | string;
  metadata: string | null | string;
  doctorId: number | string | null;
  doctorName?: string | null;
  labClientId: string | null;
  labPartnerName?: string | null;
  directPatientId: string | number | null;
  patientName?: string | null;
  externalPatientId?: number | null;
  createdByUserId?: string;
  createdAt: string;
  updatedAt: string | null;
  resultId?: number;
};

export type TestRequestsResponse = {
  items: TestRequestItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
