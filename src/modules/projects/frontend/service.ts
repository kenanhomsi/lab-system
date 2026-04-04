import { inject, injectable } from "inversify";
import { PROJECTS_FRONTEND_CLIENT } from "../names";
import type { IProjectsFrontendClient } from "../abstraction/client";
import type {
  Project,
  ProjectCreateInput,
  ProjectUpdateInput,
} from "../abstraction/types";

@injectable()
export class ProjectsFrontendService {
  constructor(
    @inject(PROJECTS_FRONTEND_CLIENT)
    private readonly client: IProjectsFrontendClient,
  ) {}

  Find(params?: Record<string, string | undefined>): Promise<Project[]> {
    return this.client.Find(params);
  }

  FindOne(id: string): Promise<Project> {
    return this.client.FindOne(id);
  }

  Create(body: ProjectCreateInput): Promise<Project> {
    return this.client.Create(body);
  }

  Update(id: string, body: ProjectUpdateInput): Promise<Project> {
    return this.client.Update(id, body);
  }

  Delete(id: string): Promise<void> {
    return this.client.Delete(id);
  }
}
