import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { userModuleNames } from "../../names";
import { UserFrontendService } from "../service";
import { ChangePasswordMeParams } from "../types";

@injectable()
class ChangePasswordMeCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
  @inject(userModuleNames.service) private userService: UserFrontendService;
  private payload!: ChangePasswordMeParams;

  init(payload: ChangePasswordMeParams) {
    this.payload = payload;
  }

  async exec() {
    const res = await this.userService.changePasswordMe(this.payload);
    this.eventService.emit("passwordChangedSuccessfully", res);
    return res;
  }
}

export { ChangePasswordMeCommand };

