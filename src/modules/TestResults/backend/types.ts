type FindAllQueryParams = {
  testRequestId?: string;
};

type AuthParams = {
  token: string;
};
type FindAllTestResultParams = AuthParams & {
  query?: FindAllQueryParams;
};

type FindTestResultParams = AuthParams & {
  id: string;
};

type CreateTestResultParams = AuthParams & {
  testRequestId: number;
  resultDate: string;
  resultData: string;
  pdfUrl: string;
  status: string;
};

type UpdateTestResultParams = AuthParams & {
  id: string;
  resultDate: string;
  resultData: string;
  pdfUrl: string;
  status: string;
};

type DeleteTestResultParams = AuthParams & {
  id: string;
};

export type {
  CreateTestResultParams,
  DeleteTestResultParams,
  FindAllTestResultParams,
  FindTestResultParams,
  UpdateTestResultParams,
};
