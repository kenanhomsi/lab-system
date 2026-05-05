import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { testResultModuleNames } from "../../names";
import { TestResultFrontendService } from "../service";
import { UpdateTestResultFrontendParams } from "../types";

@injectable()
class UpdateTestResultCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
  @inject(testResultModuleNames.service)
  private testResultService: TestResultFrontendService;
  private testResult!: UpdateTestResultFrontendParams;

  init(testResult: UpdateTestResultFrontendParams) {
    this.testResult = testResult;
  }

  async exec() {
    const res = await this.testResultService.update(this.testResult);
    this.eventService.emit("testResultUpdatedSuccessfully", res);
    return res;
  }
}
export { UpdateTestResultCommand };
