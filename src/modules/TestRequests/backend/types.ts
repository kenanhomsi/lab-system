type FindAllQueryParams = {
  Page?: string;
  PageSize?: string;
  MedicalTestId?: string;
  Status?: string;
  /** Free-text filter forwarded to upstream API when present */
  Search?: string;
  SortBy?: string;
  SortDesc?: string;
};

type AuthParams = {
  token: string;
};
type FindAllTestRequestParams = AuthParams & {
  query?: FindAllQueryParams;
};

type FindTestRequestParams = AuthParams & {
  id: string;
};

type CreateTestRequestParams = AuthParams & {
  medicalTestIds: number[];
  requestDate: string;
  status: string;
  totalAmount: number;
  notes: string;
  metadata: string;
  doctorId: string | null;
  labClientId: string | null;
  directPatientId: string | null;
  externalPatientId: number | null;
};

type UpdateTestRequestParams = AuthParams & {
  id: string;
  medicalTestId: number;
  requestDate: string;
  status: string;
  totalAmount: number;
  notes: string;
  metadata: string;
  doctorId: string | null;
  labClientId: string | null;
  directPatientId: string | null;
  externalPatientId: number | null;
};

type DeleteTestRequestParams = AuthParams & {
  id: string;
};

export type {
  CreateTestRequestParams,
  DeleteTestRequestParams,
  FindAllQueryParams,
  FindAllTestRequestParams,
  FindTestRequestParams,
  UpdateTestRequestParams,
};
