import { inject, injectable } from "inversify";
import { RegisterFrontendProps } from "../client";
import { authModuleNames } from "../../names";
import { AuthService } from "../../abstraction";
import { eventModuleNames, EventService } from "@/modules/events";

@injectable()
class Command {
  @inject(authModuleNames.service) private service: AuthService;
  @inject(eventModuleNames.service) private eventService: EventService;
  private email: string;
  private password: string;
  private fullName: string;
  private city: string;
  private phoneNumber: string;
  private role: string;

  init(params: RegisterFrontendProps) {
    const { email, password, fullName, city, phoneNumber, role } = params;
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.city = city;
    this.phoneNumber = phoneNumber;
    this.role = role;
  }

  async exec() {
    const res = await this.service.Register({
      email: this.email,
      password: this.password,
      fullName: this.fullName,
      city: this.city,
      phoneNumber: this.phoneNumber,
      role: this.role,
    });
    this.eventService.emit("RegisterSucceeded", res.message);
  }
}

export { Command as RegisterCommand };
