import { inject, injectable } from "inversify";
import type { AxiosInstance } from "axios";
import { BACKEND_AXIOS } from "@/modules/axios/backend/names";
import { BaseHttpClient } from "@/modules/axios/abstraction/axios";
import type { IProjectsBackendClient } from "../abstraction/client";
import { PROJECTS_ENDPOINTS } from "../abstraction/endpoint";
import type {
  Project,
  ProjectCreateInput,
  ProjectUpdateInput,
} from "../abstraction/types";

function authHeaders(token: string | undefined): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

@injectable()
export class ProjectsBackendClient
  extends BaseHttpClient
  implements IProjectsBackendClient
{
  constructor(@inject(BACKEND_AXIOS) http: AxiosInstance) {
    super(http);
  }

  async Find(
    token: string | undefined,
    params?: Record<string, string | undefined>,
  ): Promise<Project[]> {
    const res = await this.get<Project[]>(PROJECTS_ENDPOINTS.root, {
      params,
      headers: authHeaders(token),
    });
    return res.data;
  }

  async FindOne(token: string | undefined, id: string): Promise<Project> {
    const res = await this.get<Project>(PROJECTS_ENDPOINTS.one(id), {
      headers: authHeaders(token),
    });
    return res.data;
  }

  async Create(
    token: string | undefined,
    body: ProjectCreateInput,
  ): Promise<Project> {
    const res = await this.post<Project, ProjectCreateInput>(
      PROJECTS_ENDPOINTS.root,
      body,
      { headers: authHeaders(token) },
    );
    return res.data;
  }

  async Update(
    token: string | undefined,
    id: string,
    body: ProjectUpdateInput,
  ): Promise<Project> {
    const res = await this.patch<Project, ProjectUpdateInput>(
      PROJECTS_ENDPOINTS.one(id),
      body,
      { headers: authHeaders(token) },
    );
    return res.data;
  }

  async Delete(token: string | undefined, id: string): Promise<void> {
    await this.delete(PROJECTS_ENDPOINTS.one(id), {
      headers: authHeaders(token),
    });
  }
}
