import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
import { AppointmentTypeClient } from "../abstraction";
import { endpoint } from "./endpoint";
import {
  CreateAppointmentTypeParams,
  FindAllAppointmentTypeParams,
  FindOneAppointmentTypeParams,
  UpdateAppointmentTypeParams,
} from "./types";

type ListItem = {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
};

type ListResponse = ListItem[];

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
class Client extends AppointmentTypeClient<BackendState> {
  async findAll(params: FindAllAppointmentTypeParams) {
    const res = await super
      .sharedFindAll({ endpoint: appendQueryParams(endpoint.findAll, params.query) })
      .withAuth(params.token)
      .perform<ListResponse>();
    return res.data;
  }

  async create(params: CreateAppointmentTypeParams) {
    const { token, ...body } = params;
    const res = await super
      .sharedCreate({
        endpoint: endpoint.create,
        ...body,
      })
      .withAuth(token)
      .perform<ListItem>();
    return res.data;
  }

  async findOne(params: FindOneAppointmentTypeParams) {
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(params.id) })
      .withAuth(params.token)
      .perform<ListItem>();
    return res.data;
  }

  async update(params: UpdateAppointmentTypeParams) {
    const { id, token, ...body } = params;
    const res = await super
      .sharedUpdate({
        endpoint: endpoint.update(id),
        ...body,
      })
      .withAuth(token)
      .perform<ListItem>();
    return res.data;
  }
}

export { Client as AppointmentTypeBackendClient };
