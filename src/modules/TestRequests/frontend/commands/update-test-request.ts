import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { testRequestModuleNames } from "../../names";
import { TestRequestFrontendService } from "../service"; 
import { UpdateTestRequestFrontendParams } from "../types";

@injectable()
class UpdateTestRequestCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
    @inject(testRequestModuleNames.service)
  private testRequestService: TestRequestFrontendService;
  private testRequest!: UpdateTestRequestFrontendParams;

  init(testRequest: UpdateTestRequestFrontendParams) {
    this.testRequest = testRequest;
  }

  async exec() {
    const res = await this.testRequestService.update(this.testRequest);
    this.eventService.emit("testRequestUpdatedSuccessfully", res);
    return res;
  }
}
export { UpdateTestRequestCommand };
