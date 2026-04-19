import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { userModuleNames } from "../../names";
import { UserFrontendService } from "../service";

@injectable()
class RequestDeletionMeCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
  @inject(userModuleNames.service) private userService: UserFrontendService;

  async exec() {
    const res = await this.userService.requestDeletionMe({});
    this.eventService.emit("accountDeletionRequestedSuccessfully", res);
    return res;
  }
}

export { RequestDeletionMeCommand };

