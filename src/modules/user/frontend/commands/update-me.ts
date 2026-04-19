import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { userModuleNames } from "../../names";
import { UserFrontendService } from "../service";
import { UpdateMeParams } from "../types";

@injectable()
class UpdateMeCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
  @inject(userModuleNames.service) private userService: UserFrontendService;
  private payload!: UpdateMeParams;

  init(payload: UpdateMeParams) {
    this.payload = payload;
  }

  async exec() {
    const res = await this.userService.updateMe(this.payload);
    this.eventService.emit("profileUpdatedSuccessfully", res);
    return res;
  }
}

export { UpdateMeCommand };

