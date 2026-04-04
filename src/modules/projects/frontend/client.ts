import { inject, injectable } from "inversify";
import type { AxiosInstance } from "axios";
import { FRONTEND_AXIOS } from "@/modules/axios/frontend/names";
import { BaseHttpClient } from "@/modules/axios/abstraction/axios";
import type { IProjectsFrontendClient } from "../abstraction/client";
import { PROJECTS_ENDPOINTS } from "../abstraction/endpoint";
import type {
  Project,
  ProjectCreateInput,
  ProjectUpdateInput,
} from "../abstraction/types";

@injectable()
export class ProjectsFrontendClient
  extends BaseHttpClient
  implements IProjectsFrontendClient
{
  constructor(@inject(FRONTEND_AXIOS) http: AxiosInstance) {
    super(http);
  }

  async Find(
    params?: Record<string, string | undefined>,
  ): Promise<Project[]> {
    const res = await this.get<Project[]>(PROJECTS_ENDPOINTS.root, {
      params,
    });
    return res.data;
  }

  async FindOne(id: string): Promise<Project> {
    const res = await this.get<Project>(PROJECTS_ENDPOINTS.one(id));
    return res.data;
  }

  async Create(body: ProjectCreateInput): Promise<Project> {
    const res = await this.post<Project, ProjectCreateInput>(
      PROJECTS_ENDPOINTS.root,
      body,
    );
    return res.data;
  }

  async Update(id: string, body: ProjectUpdateInput): Promise<Project> {
    const res = await this.patch<Project, ProjectUpdateInput>(
      PROJECTS_ENDPOINTS.one(id),
      body,
    );
    return res.data;
  }

  async Delete(id: string): Promise<void> {
    await this.delete(PROJECTS_ENDPOINTS.one(id));
  }
}
