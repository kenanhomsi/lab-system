"use client";
import { useEffect } from "react";
import { eventModuleNames, EventService } from "../modules/events";
import { frontendContainer } from "@/container";
import { IEvents } from "@/modules/events/logic";

const eventService = frontendContainer.get<EventService>(
  eventModuleNames.service,
);

const useHook = <T extends keyof IEvents>(
  event: T,
  handler: (payload: IEvents[T]) => void,
) => {
  useEffect(() => {
    eventService.subscribe(event, handler);
    return () => eventService.remove(event, handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handler]);
};
export { useHook as useEventObserver };
