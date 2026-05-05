import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { testRequestModuleNames } from "../../names"; 
import { TestRequestFrontendService } from "../service";
import { DeleteTestRequestFrontendParams } from "../types";

@injectable()
class DeleteTestRequestCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
  @inject(testRequestModuleNames.service)
  private testRequestService: TestRequestFrontendService;
  private params!: DeleteTestRequestFrontendParams;

  init(params: DeleteTestRequestFrontendParams) {
    this.params = params;
  }

  async exec() {
    const res = await this.testRequestService.delete(this.params);
    this.eventService.emit("testRequestDeletedSuccessfully", res);
    return res;
  }
}

export { DeleteTestRequestCommand };
