import { Container } from "inversify";
import type { IProjectsFrontendClient } from "@/modules/projects/abstraction/client";
import {
  PROJECTS_FRONTEND_CLIENT,
  PROJECTS_FRONTEND_SERVICE,
} from "@/modules/projects/names";
import { ProjectsFrontendClient } from "@/modules/projects/frontend/client";
import { ProjectsFrontendService } from "@/modules/projects/frontend/service";

export function bindProjectsFrontend(container: Container): Container {
  container
    .bind<IProjectsFrontendClient>(PROJECTS_FRONTEND_CLIENT)
    .to(ProjectsFrontendClient)
    .inSingletonScope();
  container
    .bind(PROJECTS_FRONTEND_SERVICE)
    .to(ProjectsFrontendService)
    .inSingletonScope();
  return container;
}
