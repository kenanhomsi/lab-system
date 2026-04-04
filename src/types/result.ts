export interface TestResult {
  id: string;
  testName: string;
  result: string;
  normalRange: string;
  unit: string;
  note?: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientSex: "male" | "female";
  doctorId?: string;
  labId?: string;
  date: string;
}

export interface ResultsFilter {
  dateFrom?: string;
  dateTo?: string;
  testName?: string;
}
