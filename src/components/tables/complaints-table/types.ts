export type ComplaintStatus = "received" | "in_progress" | "resolved";

export type ComplaintItem = {
  id: number;
  userId: string;
  title: string;
  description: string;
  attachmentUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type ComplaintsResponse = {
  items: ComplaintItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
