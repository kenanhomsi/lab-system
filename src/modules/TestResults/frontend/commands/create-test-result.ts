import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { testResultModuleNames } from "../../names";
import { TestResultFrontendService } from "../service";
import { CreateTestResultFrontendParams } from "../types";

@injectable()
class CreateTestResultCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
  @inject(testResultModuleNames.service)
  private testResultService: TestResultFrontendService;
  private testResult!: CreateTestResultFrontendParams;

  init(testResult: CreateTestResultFrontendParams) {
    this.testResult = testResult;
  }

  async exec() {
    const res = await this.testResultService.create(this.testResult);
    this.eventService.emit("testResultCreatedSuccessfully", res);
    return res;
  }
}

export { CreateTestResultCommand };
