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
  private code: number;
  init(params: ResetPasswordProps) {
    const { email, newPassword, code } = params;
    this.email = email;
    this.newPassword = newPassword;
    this.code = code;
  }
  async exec() {
    const res = await this.service.ResetPassword({
      email: this.email,
      newPassword: this.newPassword,
      code: this.code,
    });
    this.eventService.emit("ResetPasswordSucceeded", res.email);
  }
}
export { Command as ResetPasswordCommand };
