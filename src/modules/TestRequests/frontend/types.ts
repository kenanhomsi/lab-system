type FindAllQueryFrontendParams = {
  Page?: string;
  PageSize?: string;
  MedicalTestId?: string;
  Status?: string;
  SortBy?: string;
  SortDesc?: string;
};

type FindAllTestRequestsFrontendParams = {
  query?: FindAllQueryFrontendParams;
};

type FindOneTestRequestFrontendParams = {
  id: string;
};

type CreateTestRequestFrontendParams = {
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

type UpdateTestRequestFrontendParams = {
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

type DeleteTestRequestFrontendParams = {
  id: string;
};

export type {
  DeleteTestRequestFrontendParams,
  FindAllQueryFrontendParams,
  FindAllTestRequestsFrontendParams,
  FindOneTestRequestFrontendParams,
  CreateTestRequestFrontendParams,
  UpdateTestRequestFrontendParams,
};
