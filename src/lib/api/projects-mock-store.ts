import type {
  Project,
  ProjectCreateInput,
  ProjectUpdateInput,
} from "@/modules/projects/abstraction/types";

const seed: Project[] = [
  {
    id: "mock-1",
    name: "UI preview project",
    description: "Mock data while UPSTREAM_BACKEND_READY is not true",
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-2",
    name: "Second mock row",
    description: "Safe to delete from UI when CRUD is wired",
    createdAt: new Date().toISOString(),
  },
];

let store: Project[] = seed.map((p) => ({ ...p }));

export function mockProjectsFind(): Project[] {
  return [...store];
}

export function mockProjectsFindOne(id: string): Project | undefined {
  return store.find((p) => p.id === id);
}

export function mockProjectsCreate(body: ProjectCreateInput): Project {
  const project: Project = {
    id: `mock-${Date.now()}`,
    name: body.name,
    description: body.description,
    createdAt: new Date().toISOString(),
  };
  store = [...store, project];
  return project;
}

export function mockProjectsUpdate(
  id: string,
  body: ProjectUpdateInput,
): Project | undefined {
  const idx = store.findIndex((p) => p.id === id);
  if (idx === -1) {
    return undefined;
  }
  const next = {
    ...store[idx],
    ...body,
    updatedAt: new Date().toISOString(),
  };
  store = store.map((p, i) => (i === idx ? next : p));
  return next;
}

export function mockProjectsDelete(id: string): boolean {
  const before = store.length;
  store = store.filter((p) => p.id !== id);
  return store.length < before;
}
