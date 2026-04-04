import { inject, injectable } from "inversify";
import { PROJECTS_BACKEND_CLIENT } from "../names";
import type { IProjectsBackendClient } from "../abstraction/client";
import type {
  Project,
  ProjectCreateInput,
  ProjectUpdateInput,
} from "../abstraction/types";

@injectable()
export class ProjectsBackendService {
  constructor(
    @inject(PROJECTS_BACKEND_CLIENT)
    private readonly client: IProjectsBackendClient,
  ) {}

  Find(
    token: string | undefined,
    params?: Record<string, string | undefined>,
  ): Promise<Project[]> {
    return this.client.Find(token, params);
  }

  FindOne(token: string | undefined, id: string): Promise<Project> {
    return this.client.FindOne(token, id);
  }

  Create(
    token: string | undefined,
    body: ProjectCreateInput,
  ): Promise<Project> {
    return this.client.Create(token, body);
  }

  Update(
    token: string | undefined,
    id: string,
    body: ProjectUpdateInput,
  ): Promise<Project> {
    return this.client.Update(token, id, body);
  }

  Delete(token: string | undefined, id: string): Promise<void> {
    return this.client.Delete(token, id);
  }
}
