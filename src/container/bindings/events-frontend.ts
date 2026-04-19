import { EventLogic, eventModuleNames, EventService } from "@/modules/events";
import { Container } from "inversify";

const bindFront = (container: Container) => {
  container.bind(eventModuleNames.logic).to(EventLogic);
  container.bind(eventModuleNames.service).to(EventService).inSingletonScope();
  return container;
};

export { bindFront as bindFrontEventDependencies };
