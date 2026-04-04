export { PROJECTS_ENDPOINTS } from "./abstraction/endpoint";
export type {
  IProjectsFrontendClient,
  IProjectsBackendClient,
} from "./abstraction/client";
export type {
  Project,
  ProjectCreateInput,
  ProjectUpdateInput,
} from "./abstraction/types";
export {
  PROJECTS_FRONTEND_CLIENT,
  PROJECTS_FRONTEND_SERVICE,
  PROJECTS_BACKEND_CLIENT,
  PROJECTS_BACKEND_SERVICE,
} from "./names";
export { ProjectsFrontendClient } from "./frontend/client";
export { ProjectsFrontendService } from "./frontend/service";
export { ProjectsBackendClient } from "./backend/client";
export { ProjectsBackendService } from "./backend/service";
