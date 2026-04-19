import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { userModuleNames } from "../../names";
import { UserFrontendService } from "../service";
import { DeleteUserParams } from "../types";

@injectable()
class DeleteUserCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
  @inject(userModuleNames.service) private userService: UserFrontendService;
  private params!: DeleteUserParams;

  init(params: DeleteUserParams) {
    this.params = params;
  }

  async exec() {
    const res = await this.userService.delete(this.params);
    this.eventService.emit("userDeletedSuccessfully", res);
    return res;
  }
}

export { DeleteUserCommand };
