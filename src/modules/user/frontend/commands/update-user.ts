import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { userModuleNames } from "../../names";
import { UserFrontendService } from "../service";
import { UpdateUserParams } from "../types";

@injectable()
class UpdateUserCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
  @inject(userModuleNames.service) private userService: UserFrontendService;
  private user!: UpdateUserParams;

  init(user: UpdateUserParams) {
    this.user = user;
  }

  async exec() {
    console.log('update user command')
    const res = await this.userService.update(this.user);
    this.eventService.emit("userUpdatedSuccessfully", res);
    console.log('user updated successfully')
    return res;
  }
}
export { UpdateUserCommand };
