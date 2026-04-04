export interface InsuranceRequest {
  id: string;
  userId: string;
  insuredName: string;
  insuranceNumber: string;
  mobile: string;
  cardImageUrl: string;
  prescriptionImageUrl: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface InsuranceRequestPayload {
  insuredName: string;
  insuranceNumber: string;
  mobile: string;
}
