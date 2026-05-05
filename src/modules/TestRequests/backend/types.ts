type FindAllQueryParams = {
  Page?: string;
  PageSize?: string;
  MedicalTestId?: string;
  Status?: string;
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
  medicalTestId: number;
  requestDate: string;
  status: string;
  totalAmount: number;
  notes: string;
  metadata: string;
  doctorId: string | null;
  labClientId: string | null;
  directPatientId: string | null;
  externalPatientId: number;
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
  externalPatientId: number;
};

type DeleteTestRequestParams = AuthParams & {
  id: string;
};

export type {
  CreateTestRequestParams,
  DeleteTestRequestParams,
  FindAllTestRequestParams,
  FindTestRequestParams,
  UpdateTestRequestParams,
};
