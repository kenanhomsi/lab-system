"use client";

import { useEffect } from "react";
import { frontendContainer } from "@/container/frontend";
import {
  eventModuleNames,
  type EventName,
  type IEvents,
  EventService,
} from "../modules/events";

const eventService = frontendContainer.get<EventService>(
  eventModuleNames.service,
);

function useEventObserver<T extends EventName>(
  event: T,
  handler: (payload: IEvents[T]) => void,
): void {
  useEffect(() => {
    eventService.subscribe(event, handler);
    return () => {
      eventService.remove(event, handler);
    };
  }, [event, handler]);
}

export { useEventObserver };
