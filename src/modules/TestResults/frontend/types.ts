type FindAllQueryFrontendParams = {
  testRequestId?: string;
};

type FindAllTestResultsFrontendParams = {
  query?: FindAllQueryFrontendParams;
};

type FindOneTestResultFrontendParams = {
  id: string;
};

type CreateTestResultFrontendParams = {
  testRequestId: number;
  resultDate: string;
  resultData: string;
  pdfUrl: string;
  status: string;
};

type UpdateTestResultFrontendParams = {
  id: string;
  resultDate: string;
  resultData: string;
  pdfUrl: string;
  status: string;
};

type DeleteTestResultFrontendParams = {
  id: string;
};

export type {
  DeleteTestResultFrontendParams,
  FindAllQueryFrontendParams,
  FindAllTestResultsFrontendParams,
  FindOneTestResultFrontendParams,
  CreateTestResultFrontendParams,
  UpdateTestResultFrontendParams,
};
