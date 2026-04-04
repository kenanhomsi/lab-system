export const PROJECTS_ENDPOINTS = {
  root: "/projects",
  one: (id: string) => `/projects/${id}` as const,
} as const;
