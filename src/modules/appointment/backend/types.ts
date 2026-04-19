type FindAllQueryParams = {
  Page?: string;
  PageSize?: string;
  PatientId?: string;
  DoctorId?: string;
  LabPartnerId?: string;
  Status?: string;
  Search?: string;
};

type FindAllAppointmentParams = {
  token: string;
  query?: FindAllQueryParams;
};

type CreateAppointmentParams = {
  token: string;
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

type FindOneAppointmentParams = {
  token: string;
  id: string;
};

type ConfirmAppointmentParams = {
  token: string;
  id: string;
};

type CancelAppointmentParams = {
  token: string;
  id: string;
};

export type {
  CancelAppointmentParams,
  ConfirmAppointmentParams,
  CreateAppointmentParams,
  FindAllAppointmentParams,
  FindAllQueryParams,
  FindOneAppointmentParams,
};
