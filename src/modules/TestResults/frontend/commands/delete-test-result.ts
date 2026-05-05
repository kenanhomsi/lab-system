import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { testResultModuleNames } from "../../names";
import { TestResultFrontendService } from "../service";
import { DeleteTestResultFrontendParams } from "../types";

@injectable()
class DeleteTestResultCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
  @inject(testResultModuleNames.service)
  private testResultService: TestResultFrontendService;
  private params!: DeleteTestResultFrontendParams;

  init(params: DeleteTestResultFrontendParams) {
    this.params = params;
  }

  async exec() {
    const res = await this.testResultService.delete(this.params);
    this.eventService.emit("testResultDeletedSuccessfully", res);
    return res;
  }
}

export { DeleteTestResultCommand };
