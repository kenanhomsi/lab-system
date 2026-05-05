import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { medicalTestModuleNames } from "../../names";
import { MedicalTestFrontendService } from "../service";
import { CreateMedicalTestParams } from "../types";

@injectable()
class CreateMedicalTestCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
  @inject(medicalTestModuleNames.service)
  private medicalTestService: MedicalTestFrontendService;
  private medicalTest!: CreateMedicalTestParams;

  init(medicalTest: CreateMedicalTestParams) {
    this.medicalTest = medicalTest;
  }

  async exec() {
    const res = await this.medicalTestService.create(this.medicalTest);
    this.eventService.emit("medicalTestCreatedSuccessfully", res);
    return res;
  }
}

export { CreateMedicalTestCommand };
