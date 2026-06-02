import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { vacantJobModuleNames } from "../../names";
import { VacantJobFrontendService } from "../service";
import { DeleteVacantJobParams } from "../types";

@injectable()
class DeleteVacantJobCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
  @inject(vacantJobModuleNames.service)
  private vacantJobService: VacantJobFrontendService;
  private params!: DeleteVacantJobParams;

  init(params: DeleteVacantJobParams) {
    this.params = params;
  }

  async exec() {
    const res = await this.vacantJobService.delete(this.params);
    this.eventService.emit("vacantJobDeletedSuccessfully", res);
    return res;
  }
}

export { DeleteVacantJobCommand };
