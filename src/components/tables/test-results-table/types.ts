export type TestResultItem = {
  id: number;
  testRequestId: number;
  testRequestCreatedByUserId?: string | null;
  testRequestCreatedByName?: string | null;
  testRequestCreatedByFullName?: string | null;
  resultDate: string;
  resultData: string | Record<string, string>;
  pdfUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
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
