import { inject, injectable } from "inversify";
import { loginParams } from "../client";
import { authModuleNames } from "../../names";
import { AuthService } from "../../abstraction";
import { eventModuleNames, EventService } from "@/modules/events";
import { getSession } from "next-auth/react";
import { useSessionUserStore } from "@/stores/session-user-store";

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
    const u = session?.user;
    if (u?.id) {
      useSessionUserStore.getState().setSessionUser({
        id: u.id,
        roles: Array.isArray(u.roles) ? [...u.roles] : [],
        email: u.email,
        fullName: u.fullName,
      });
    }
    this.eventService.emit("LoginSucceeded", {
      roles: session?.user?.roles ?? [],
    });
  }
}
export { Command as LoginCommand };
