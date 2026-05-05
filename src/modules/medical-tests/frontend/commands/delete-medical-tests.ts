import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { medicalTestModuleNames } from "../../names";
import { MedicalTestFrontendService } from "../service";
import { DeleteMedicalTestParams } from "../types";

@injectable()
class DeleteMedicalTestCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
  @inject(medicalTestModuleNames.service)
  private medicalTestService: MedicalTestFrontendService;
  private params!: DeleteMedicalTestParams;

  init(params: DeleteMedicalTestParams) {
    this.params = params;
  }

  async exec() {
    const res = await this.medicalTestService.delete(this.params);
    this.eventService.emit("medicalTestDeletedSuccessfully", res);
    return res;
  }
}

export { DeleteMedicalTestCommand };
