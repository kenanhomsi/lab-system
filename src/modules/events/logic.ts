import { EventEmitter } from "events";
import { injectable } from "inversify";
import type { EventName, EventPayload } from "./types";

@injectable()
class Event {
  private readonly emitter = new EventEmitter();

  send<K extends EventName>(event: K, payload: EventPayload<K>): void {
    this.emitter.emit(event, payload);
  }

  register<K extends EventName>(
    event: K,
    callback: (payload: EventPayload<K>) => void,
  ): void {
    this.emitter.on(event, callback as (payload: unknown) => void);
  }

  remove<K extends EventName>(
    event: K,
    callback: (payload: EventPayload<K>) => void,
  ): void {
    this.emitter.off(event, callback as (payload: unknown) => void);
  }

  
}
export { Event };