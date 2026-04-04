export interface Vacancy {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  isActive: boolean;
}

export interface EmploymentApplication {
  id: string;
  fullName: string;
  city: string;
  mobile: string;
  email: string;
  degree: string;
  previousExperience: string;
  yearsOfExperience: number;
  skills: string;
  additionalCertifications?: string;
  vacancyId: string;
  cvUrl: string;
  createdAt: string;
}

export interface ClientApplication {
  id: string;
  managerName: string;
  labName: string;
  mobile: string;
  email: string;
  address: string;
  additionalInfo?: string;
  createdAt: string;
}
