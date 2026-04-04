export interface SubscriptionPackage {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  durationDays: number;
  features: string[];
}

export interface Subscription {
  id: string;
  packageId: string;
  packageName: string;
  userId: string;
  startDate: string;
  endDate: string;
  lastProcedureDate?: string;
  nextProcedureDate?: string;
  isActive: boolean;
}
