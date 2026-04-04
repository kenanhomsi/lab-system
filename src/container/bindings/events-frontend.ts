import { Container } from "inversify";
import { Event } from "@/modules/events/logic";
import { Service } from "@/modules/events/service";
import { names } from "@/modules/events/names";

export function bindEventsFrontend(container: Container): Container {
  container.bind(names.logic).to(Event).inSingletonScope();
  container.bind(names.service).to(Service).inSingletonScope();
  return container;
}
