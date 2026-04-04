export type DrawLocation = "lab" | "home" | "work";

export interface AppointmentPayload {
  patientName: string;
  age: number;
  gender: "male" | "female";
  mobile: string;
  drawLocation: DrawLocation;
  dateTime: string;
  requiredTests: string;
  prescriptionImage?: string;
  medicalCondition?: string;
  address: string;
  lat?: number;
  lng?: number;
  savedAddressId?: string;
  referredByDoctorId?: string;
}

export interface Appointment extends AppointmentPayload {
  id: string;
  patientId: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
