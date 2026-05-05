export type TestRequestItem = {
  id: number;
  medicalTestId: number;
  medicalTestNameEn?: string | null;
  externalPatientFullName?: string | null;
  requestDate: string;
  status: string;
  totalAmount: number;
  notes: string | null | string;
  metadata: string | null | string;
  doctorId: number | string | null;
  labClientId: string | null;
  directPatientId: string | number | null;
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
