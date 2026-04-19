import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
import { AppointmentClient } from "../abstraction";
import { endpoint } from "./endpoint";
import {
  CancelAppointmentParams,
  ConfirmAppointmentParams,
  CreateAppointmentParams,
  FindAllAppointmentParams,
  FindOneAppointmentParams,
} from "./types";

type AppointmentItem = {
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

type AppointmentsResponse = {
  items: AppointmentItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const appendQueryParams = (
  path: string,
  query?: Record<string, string | undefined>,
) => {
  if (!query) return path;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") {
      params.set(key, value);
    }
  }
  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
};

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends AppointmentClient<AxiosState> {
  async findAll(params: FindAllAppointmentParams) {
    const res = await super
      .sharedFindAll({ endpoint: appendQueryParams(endpoint.findAll, params.query) })
      .perform<AppointmentsResponse>();
    return res.data;
  }

  async create(params: CreateAppointmentParams) {
    const res = await super
      .sharedCreate({
        endpoint: endpoint.create,
        ...params,
      })
      .perform<AppointmentItem>();
    return res.data;
  }

  async findOne(params: FindOneAppointmentParams) {
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(params.id) })
      .perform<AppointmentItem>();
    return res.data;
  }

  async confirm(params: ConfirmAppointmentParams) {
    const res = await super
      .sharedConfirm({ endpoint: endpoint.confirm(params.id) })
      .perform<void>();
    return res.data;
  }

  async cancel(params: CancelAppointmentParams) {
    const res = await super
      .sharedCancel({ endpoint: endpoint.cancel(params.id) })
      .perform<void>();
    return res.data;
  }
}

export { Client as AppointmentFrontendClient };
