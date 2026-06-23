export type Appointment = {
  id: number;
  availabilityId: number;
  testRequestId: number;
  userId: string;
  startTime: string;
  endTime: string;
  status: string;
  patientLocationType: string;
  patientLatitude?: number | null;
  patientLongitude?: number | null;
  notes?: string | null;
  createdByUserId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export const APPOINTMENT_ADMIN_STATUSES = [
  "SCHEDULED",
  "CONFIRMED",
  "COMPLETED",
  "PENDING",
  "CANCELLED",
] as const;

export type AppointmentAdminStatus = (typeof APPOINTMENT_ADMIN_STATUSES)[number];

export type UpdateAppointmentStatusInput = {
  status: AppointmentAdminStatus;
};

export type CreateAppointmentInput = {
  availabilityId: number;
  testRequestId: number;
  userId: string;
  patientLocationType: string;
  patientLatitude?: number | null;
  patientLongitude?: number | null;
  notes?: string;
  startTime?: string;
  endTime?: string;
};

export type DayAvailabilityInput = {
  date: string;
};

export type AppointmentSlot = {
  id: number;
  availabilityId: number;
  userId?: string | null;
  dayOfWeek?: number | null;
  startTime: string;
  endTime: string;
  slotDuration?: number | null;
  isActive?: boolean | null;
  isAvailable?: boolean | null;
};

export type Availability = {
  id: number;
  userId: string | null;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type UpsertAvailabilityInput = {
  userId: string | null;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive: boolean;
};
