type FindAllQueryParams = {
  Page?: string;
  PageSize?: string;
};

type FindAllAppointmentTypeParams = {
  query?: FindAllQueryParams;
};

type CreateAppointmentTypeParams = {
  name: string;
};

type FindOneAppointmentTypeParams = {
  id: string;
};

type UpdateAppointmentTypeParams = {
  id: string;
  name: string;
  isActive: boolean;
};

export type {
  CreateAppointmentTypeParams,
  FindAllQueryParams,
  FindAllAppointmentTypeParams,
  FindOneAppointmentTypeParams,
  UpdateAppointmentTypeParams,
};
