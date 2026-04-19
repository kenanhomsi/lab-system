import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
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
class Client extends AppointmentTypeClient<AxiosState> {
  async findAll(params: FindAllAppointmentTypeParams) {
    const res = await super
      .sharedFindAll({ endpoint: appendQueryParams(endpoint.findAll, params.query) })
      .perform<ListResponse>();
    return res.data;
  }

  async create(params: CreateAppointmentTypeParams) {
    const res = await super
      .sharedCreate({
        endpoint: endpoint.create,
        ...params,
      })
      .perform<ListItem>();
    return res.data;
  }

  async findOne(params: FindOneAppointmentTypeParams) {
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(params.id) })
      .perform<ListItem>();
    return res.data;
  }

  async update(params: UpdateAppointmentTypeParams) {
    const { id, ...body } = params;
    const res = await super
      .sharedUpdate({
        endpoint: endpoint.update(id),
        ...body,
      })
      .perform<ListItem>();
    return res.data;
  }
}

export { Client as AppointmentTypeFrontendClient };
