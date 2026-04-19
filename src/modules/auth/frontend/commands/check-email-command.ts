import { inject, injectable } from "inversify";
import { authModuleNames } from "../../names";
import { AuthService } from "../../abstraction";
import { eventModuleNames, EventService } from "@/modules/events";
import { CheckEmailProps } from "../../backend";

@injectable()
class Command {
  @inject(authModuleNames.service) private service: AuthService;
  @inject(eventModuleNames.service) private eventService: EventService;
  private email: string;
  init(params: CheckEmailProps) {
    const { email } = params;
    this.email = email;
  }
  async exec() {
    const res = await this.service.CheckEmail({
      email: this.email,
    });
    this.eventService.emit("checkEmailSucceeded", res.email);
  }
}
export { Command as CheckEmailCommand };
