import { eventModuleNames, EventService } from "@/modules/events";
import { inject, injectable } from "inversify";
import { userModuleNames } from "../../names";
import { UserFrontendService } from "../service";
import { CreateUserParams } from "../types";

@injectable()
class CreateUserCommand {
  @inject(eventModuleNames.service) private eventService: EventService;
  @inject(userModuleNames.service) private userService: UserFrontendService;
  private user!: CreateUserParams;

  init(user: CreateUserParams) {
    this.user = user;
  }

  async exec() {
    const res = await this.userService.create(this.user);
    this.eventService.emit("userCreatedSuccessfully", res);
    return res;
  }
}

export { CreateUserCommand };
