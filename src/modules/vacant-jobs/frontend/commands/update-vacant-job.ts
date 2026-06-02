import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { vacantJobModuleNames } from "../../names";
import { VacantJobFrontendService } from "../service";
import { UpdateVacantJobParams } from "../types";

@injectable()
class UpdateVacantJobCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
  @inject(vacantJobModuleNames.service)
  private vacantJobService: VacantJobFrontendService;
  private params!: UpdateVacantJobParams;

  init(params: UpdateVacantJobParams) {
    this.params = params;
  }

  async exec() {
    const res = await this.vacantJobService.update(this.params);
    this.eventService.emit("vacantJobUpdatedSuccessfully", res);
    return res;
  }
}

export { UpdateVacantJobCommand };
