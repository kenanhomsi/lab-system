import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { userModuleNames } from "../../names";
import { UserFrontendService } from "../service";
import { DeactivateUserParams } from "../types";

@injectable()
class DeactivateUserCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
  @inject(userModuleNames.service) private userService: UserFrontendService;
  private params!: DeactivateUserParams;

  init(params: DeactivateUserParams) {
    this.params = params;
  }

  async exec() {
    const res = await this.userService.deactivate(this.params);
    this.eventService.emit("userDeactivatedSuccessfully", res);
    return res;
  }
}

export { DeactivateUserCommand };
