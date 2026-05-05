import { EventEmitter } from "events";
import { injectable } from "inversify";
import type {
  authEvents,
  doctorAppointmentEvents,
  labAppointmentEvents,
  medicalTestEvents,
  patientAppointmentEvents,
  testRequestEvents,
  testResultEvents,
} from "./types";
type IEvents = authEvents &
  doctorAppointmentEvents &
  labAppointmentEvents &
  medicalTestEvents &
  patientAppointmentEvents &
  testRequestEvents &
  testResultEvents;
@injectable()
class Event {
  events = new EventEmitter();
  send<T extends keyof IEvents>(event: T, payload: IEvents[T]) {
    this.events.emit(event, payload);
  }
  register<T extends keyof IEvents>(
    event: T,
    cb: (payload: IEvents[T]) => void,
  ) {
    this.events.addListener(event, cb);
  }
  remove<T extends keyof IEvents>(event: T, cb: (payload: IEvents[T]) => void) {
    this.events.off(event, cb);
  }
}
export { Event };
export type { IEvents };
