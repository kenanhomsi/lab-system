export interface LabOrderPatient {
  name: string;
  age: number;
  gender: "male" | "female";
  tests: LabOrderTest[];
}

export interface LabOrderTest {
  testId: string;
  testName: string;
  requiredSample: string;
  price: number;
}

export interface LabOrder {
  id: string;
  labId: string;
  date: string;
  patients: LabOrderPatient[];
  totalAmount: number;
  status: "pending" | "received" | "processing" | "completed";
  createdAt: string;
}

export interface LabAccountingEntry {
  id: string;
  labId: string;
  patientName: string;
  tests: string[];
  pricePerTest: number[];
  totalPrice: number;
  payment: number;
  date: string;
}

export interface LabAccountingSummary {
  entries: LabAccountingEntry[];
  totalTestsAmount: number;
  totalPayments: number;
  balanceDue: number;
}
