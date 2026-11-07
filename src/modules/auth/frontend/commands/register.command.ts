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
  private age?: number;
  private gender?: "male" | "female";
  private specialty?: string;
  private labName?: string;
  private role: string;

  init(params: RegisterFrontendProps) {
    const { email, password, fullName, city, phoneNumber, age, gender, specialty, labName, role } = params;
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.city = city;
    this.phoneNumber = phoneNumber;
    this.age = age;
    this.gender = gender;
    this.specialty = specialty;
    this.labName = labName;
    this.role = role;
  }

  async exec() {
    const res = await this.service.Register({
      email: this.email,
      password: this.password,
      fullName: this.fullName,
      city: this.city,
      phoneNumber: this.phoneNumber,
      age: this.age,
      gender: this.gender,
      specialty: this.specialty,
      labName: this.labName,
      role: this.role,
    });
    this.eventService.emit("RegisterSucceeded", res.message);
  }
}

export { Command as RegisterCommand };
