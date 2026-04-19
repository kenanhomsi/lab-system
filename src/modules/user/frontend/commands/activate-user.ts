import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { userModuleNames } from "../../names";
import { UserFrontendService } from "../service";
import { ActivateUserParams } from "../types";

@injectable()
class ActivateUserCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
  @inject(userModuleNames.service) private userService: UserFrontendService;
  private params!: ActivateUserParams;

  init(params: ActivateUserParams) {
    this.params = params;
  }

  async exec() {
    const res = await this.userService.activate(this.params);
    this.eventService.emit("userActivatedSuccessfully", res);
    return res;
  }
}

export { ActivateUserCommand };
