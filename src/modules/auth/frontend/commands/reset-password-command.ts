import { inject, injectable } from "inversify";
import { authModuleNames } from "../../names";
import { AuthService, type ResetPasswordProps } from "../../abstraction";
import { eventModuleNames, EventService } from "@/modules/events";

@injectable()
class Command {
  @inject(authModuleNames.service) private service: AuthService;
  @inject(eventModuleNames.service) private eventService: EventService;
  private newPassword: string;
  private email: string;
  private token: string;
  init(params: ResetPasswordProps) {
    const { email, newPassword, token } = params;
    this.email = email;
    this.newPassword = newPassword;
    this.token = token;
  }
  async exec() {
    await this.service.ResetPassword({
      email: this.email,
      newPassword: this.newPassword,
      token: this.token,
    });
    this.eventService.emit("ResetPasswordSucceeded", this.email);
  }
}
export { Command as ResetPasswordCommand };
