import { inject, injectable } from "inversify";
import { appointmentTypeModuleNames } from "../names";
import { AppointmentTypeBackendClient } from "./client";
import {
  CreateAppointmentTypeParams,
  FindAllAppointmentTypeParams,
  FindOneAppointmentTypeParams,
  UpdateAppointmentTypeParams,
} from "./types";

@injectable()
class Service {
  @inject(appointmentTypeModuleNames.client)
  private Client: AppointmentTypeBackendClient;

  async findAll(params: FindAllAppointmentTypeParams) {
    return this.Client.findAll(params);
  }

  async create(params: CreateAppointmentTypeParams) {
    return this.Client.create(params);
  }

  async findOne(params: FindOneAppointmentTypeParams) {
    return this.Client.findOne(params);
  }

  async update(params: UpdateAppointmentTypeParams) {
    return this.Client.update(params);
  }
}

export { Service as AppointmentTypeBackendService };
