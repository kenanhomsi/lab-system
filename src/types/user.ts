export type UserRole = "patient" | "doctor" | "lab" | "special";

export interface User {
  id: string;
  role: UserRole;
  email: string;
  mobile: string;
  fullName: string;
  city: string;
  institutionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientUser extends User {
  role: "patient";
  age: number;
  gender: "male" | "female";
}

export interface DoctorUser extends User {
  role: "doctor";
  specialty: string;
}

export interface LabUser extends User {
  role: "lab";
  labName: string;
}

export interface SpecialUser extends User {
  role: "special";
}

export type AnyUser = PatientUser | DoctorUser | LabUser | SpecialUser;

export interface RegisterPayload {
  role: Exclude<UserRole, "special">;
  email: string;
  mobile: string;
  fullName: string;
  city: string;
  password: string;
  age?: number;
  gender?: "male" | "female";
  specialty?: string;
  labName?: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
  role: UserRole;
}

export interface SavedAddress {
  id: string;
  label: string;
  address: string;
  lat: number;
  lng: number;
}
