import type {
  Project,
  ProjectCreateInput,
  ProjectUpdateInput,
} from "./types";

export interface IProjectsFrontendClient {
  Find(params?: Record<string, string | undefined>): Promise<Project[]>;
  FindOne(id: string): Promise<Project>;
  Create(body: ProjectCreateInput): Promise<Project>;
  Update(id: string, body: ProjectUpdateInput): Promise<Project>;
  Delete(id: string): Promise<void>;
}

export interface IProjectsBackendClient {
  Find(
    token: string | undefined,
    params?: Record<string, string | undefined>,
  ): Promise<Project[]>;
  FindOne(token: string | undefined, id: string): Promise<Project>;
  Create(
    token: string | undefined,
    body: ProjectCreateInput,
  ): Promise<Project>;
  Update(
    token: string | undefined,
    id: string,
    body: ProjectUpdateInput,
  ): Promise<Project>;
  Delete(token: string | undefined, id: string): Promise<void>;
}
