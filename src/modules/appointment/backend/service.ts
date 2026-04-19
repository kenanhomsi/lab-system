import { inject, injectable } from "inversify";
import { appointmentModuleNames } from "../names";
import { AppointmentBackendClient } from "./client";
import {
  CancelAppointmentParams,
  ConfirmAppointmentParams,
  CreateAppointmentParams,
  FindAllAppointmentParams,
  FindOneAppointmentParams,
} from "./types";

@injectable()
class Service {
  @inject(appointmentModuleNames.client) private Client: AppointmentBackendClient;

  async findAll(params: FindAllAppointmentParams) {
    return this.Client.findAll(params);
  }

  async create(params: CreateAppointmentParams) {
    return this.Client.create(params);
  }

  async findOne(params: FindOneAppointmentParams) {
    return this.Client.findOne(params);
  }

  async confirm(params: ConfirmAppointmentParams) {
    return this.Client.confirm(params);
  }

  async cancel(params: CancelAppointmentParams) {
    return this.Client.cancel(params);
  }
}

export { Service as AppointmentBackendService };
