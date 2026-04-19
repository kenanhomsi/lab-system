import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { appointmentModuleNames } from "../../names";
import { AppointmentFrontendService } from "../service";
import { CreateAppointmentParams } from "../types";

@injectable()
class CreateAppointmentCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
  @inject(appointmentModuleNames.service)
  private appointmentService: AppointmentFrontendService;
  private appointment!: CreateAppointmentParams;

  init(appointment: CreateAppointmentParams) {
    this.appointment = appointment;
  }

  async exec() {
    const res = await this.appointmentService.create(this.appointment);
    this.eventService.emit("appointmentCreatedSuccessfully", res);
    return res;
  }
}

export { CreateAppointmentCommand };
