import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { vacantJobModuleNames } from "../../names";
import { VacantJobFrontendService } from "../service";
import { CreateVacantJobParams } from "../types";

@injectable()
class CreateVacantJobCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
  @inject(vacantJobModuleNames.service)
  private vacantJobService: VacantJobFrontendService;
  private params!: CreateVacantJobParams;

  init(params: CreateVacantJobParams) {
    this.params = params;
  }

  async exec() {
    const res = await this.vacantJobService.create(this.params);
    this.eventService.emit("vacantJobCreatedSuccessfully", res);
    return res;
  }
}

export { CreateVacantJobCommand };
