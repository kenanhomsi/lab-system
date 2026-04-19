export type AppointmentItem = {
  id: number;
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
  status: string;
  patientId: string;
  doctorId: string;
  labPartnerId: string;
  medicalTestId: number;
  medicalTestCompletionStatus: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
};

export type AppointmentsResponse = {
  items: AppointmentItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type CreateAppointmentRequest = {
  appointmentTypeId: number;
  name: string;
  description: string;
  notes: string;
  slot: string;
  locationType: string;
  address: string;
  latitude: number;
  longitude: number;
  patientId: string;
  doctorId: string;
  labPartnerId: string;
};

export type AppointmentModalType = "create" | "confirm" | "cancel";
