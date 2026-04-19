import { inject, injectable } from "inversify";
import { loginParams } from "../client";
import { authModuleNames } from "../../names";
import { AuthService } from "../../abstraction";
import { eventModuleNames, EventService } from "@/modules/events";
import { getSession } from "next-auth/react";

@injectable()
class Command {
  @inject(authModuleNames.service) private service: AuthService;
  @inject(eventModuleNames.service) private eventService: EventService;
  private password: string;
  private email: string;
  init(params: loginParams) {
    const { email, password } = params;
    this.email = email;
    this.password = password;
  }
  async exec() {
    await this.service.login({ email: this.email, password: this.password });
    const session = await getSession();
    this.eventService.emit("LoginSucceeded", {
      roles: session?.user?.roles ?? [],
    });
  }
}
export { Command as LoginCommand };
