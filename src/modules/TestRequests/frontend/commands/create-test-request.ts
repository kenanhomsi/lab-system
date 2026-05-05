import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { testRequestModuleNames } from "../../names";
import { TestRequestFrontendService } from "../service";
import { CreateTestRequestFrontendParams } from "../types";

@injectable()
class CreateTestRequestCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
  @inject(testRequestModuleNames.service)
  private testRequestService: TestRequestFrontendService;
  private testRequest!: CreateTestRequestFrontendParams;

  init(testRequest: CreateTestRequestFrontendParams) {
    this.testRequest = testRequest;
  }

  async exec() {
    const res = await this.testRequestService.create(this.testRequest);
    this.eventService.emit("testRequestCreatedSuccessfully", res);
    return res;
  }
}

export { CreateTestRequestCommand };
