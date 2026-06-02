export type EmploymentApplicationStatus =
  | "New"
  | "Pending"
  | "InReview"
  | "Accepted"
  | "Rejected";

export type EmploymentApplicationItem = {
  id: number;
  fullName: string;
  residencePlace: string;
  mobileNumber: string;
  email: string;
  academicDegree: string;
  previousExperience: string;
  yearsOfExperience: number;
  skills: string;
  additionalCertificates: string | null;
  vacantJobId: number;
  vacantJobTitleAr: string;
  vacantJobTitleEn: string;
  cvFileUrl: string;
  cvOriginalFileName: string;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type EmploymentApplicationsResponse = {
  items: EmploymentApplicationItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
