export type AppointmentTypeItem = {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
};

export type AppointmentTypesResponse = AppointmentTypeItem[];

export type CreateAppointmentTypeRequest = {
  name: string;
};

export type UpdateAppointmentTypeRequest = CreateAppointmentTypeRequest;

export type AppointmentTypeModalType = "create" | "edit" | null;
