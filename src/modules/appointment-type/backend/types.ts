type AuthParams = {
  token: string;
};

type FindAllQueryParams = {
  Page?: string;
  PageSize?: string;
};

type FindAllAppointmentTypeParams = AuthParams & {
  query?: FindAllQueryParams;
};

type CreateAppointmentTypeParams = AuthParams & {
  name: string;
};

type FindOneAppointmentTypeParams = AuthParams & {
  id: string;
};

type UpdateAppointmentTypeParams = AuthParams & {
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
