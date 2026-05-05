export type TestResultItem = {
  id: number;
  testRequestId: number;
  resultDate: string;
  resultData: string;
  pdfUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type TestResultsResponse = {
  items: TestResultItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
