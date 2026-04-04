import { inject, injectable } from "inversify";
import { Event } from "./logic";
import { IEvents } from "./types";
import { names } from "./names";

type EventListener<T> = (payload: T) => void;
@injectable()
class Service {
  @inject(names.logic) private logic: Event;

  subscribe<T extends keyof IEvents>(event: T, cb: EventListener<IEvents[T]>) {
    this.logic.register(event, cb);
  }
  emit<T extends keyof IEvents>(event: T, payload: IEvents[T]) {
    this.logic.send(event, payload);
  }
  remove<T extends keyof IEvents>(event: T, cb: EventListener<IEvents[T]>) {
    this.logic.remove(event, cb);
  }
}
export { Service };
