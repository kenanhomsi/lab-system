import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { medicalTestModuleNames } from "../../names";
import { MedicalTestFrontendService } from "../service";
import { UpdateMedicalTestParams } from "../types";

@injectable()
class UpdateMedicalTestCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
  @inject(medicalTestModuleNames.service)
  private medicalTestService: MedicalTestFrontendService;
  private medicalTest!: UpdateMedicalTestParams;

  init(medicalTest: UpdateMedicalTestParams) {
    this.medicalTest = medicalTest;
  }

  async exec() {
    console.log("update medical test command");
    const res = await this.medicalTestService.update(this.medicalTest);
    this.eventService.emit("medicalTestUpdatedSuccessfully", res);
    return res;
  }
}
export { UpdateMedicalTestCommand };
