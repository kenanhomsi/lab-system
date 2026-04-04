import { Container } from "inversify";
import type { IProjectsBackendClient } from "@/modules/projects/abstraction/client";
import {
  PROJECTS_BACKEND_CLIENT,
  PROJECTS_BACKEND_SERVICE,
} from "@/modules/projects/names";
import { ProjectsBackendClient } from "@/modules/projects/backend/client";
import { ProjectsBackendService } from "@/modules/projects/backend/service";

export function bindProjectsBackend(container: Container): Container {
  container
    .bind<IProjectsBackendClient>(PROJECTS_BACKEND_CLIENT)
    .to(ProjectsBackendClient)
    .inSingletonScope();
  container
    .bind(PROJECTS_BACKEND_SERVICE)
    .to(ProjectsBackendService)
    .inSingletonScope();
  return container;
}
