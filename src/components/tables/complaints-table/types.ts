export type { ComplaintStatus } from "@/lib/complaint-status";

export type ComplaintItem = {
  id: number;
  userId: string;
  title: string;
  description: string;
  note: string;
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
