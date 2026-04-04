export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ProjectCreateInput = Pick<Project, "name"> & {
  description?: string;
};

export type ProjectUpdateInput = Partial<
  Pick<Project, "name" | "description">
>;
