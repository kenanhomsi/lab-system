export interface DoctorPatientReport {
  id: string;
  patientName: string;
  date: string;
  amount: number;
}

export interface DoctorPatientSummary {
  reports: DoctorPatientReport[];
  totalAmount: number;
}
