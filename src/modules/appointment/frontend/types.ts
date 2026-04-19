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
  query?: FindAllQueryParams;
};

type CreateAppointmentParams = {
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
  id: string;
};

type ConfirmAppointmentParams = {
  id: string;
};

type CancelAppointmentParams = {
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
