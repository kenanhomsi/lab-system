/**
 * Patient Appointments Page Types
 * Defines types for the appointments CRUD page
 */

export interface AppointmentItem {
  id: string;
  appointmentTypeId: number;
  appointmentTypeName: string;
  name: string;
  description: string;
  notes: string;
  slot: string;
  locationType: string;
  address: string;
  latitude: number;
  longitude: number;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  patientId: string;
  doctorId: string;
  doctorName?: string;
  labPartnerId: string;
  medicalTestId: number | null;
  medicalTestCompletionStatus: string | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentsPaginatedResponse {
  items: AppointmentItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AppointmentsPageState {
  appointments: AppointmentItem[];
  selectedAppointment: AppointmentItem | null;
  isCreateModalOpen: boolean;
  isCancelModalOpen: boolean;
  isCancelConfirmOpen: boolean;
  isDetailsModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  totalPages: number;
  statusFilter: "upcoming" | "completed" | "cancelled" | "all";
}

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";
