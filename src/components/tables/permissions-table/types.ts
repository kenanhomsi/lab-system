export type PermissionItem = {
  id: string;
  name: string;
  description: string;
};

export type PermissionsResponse = PermissionItem[];

export type CreatePermissionRequest = {
  name: string;
  description: string;
};

export type UpdatePermissionRequest = {
  description: string;
};

export type PermissionModalType = "create" | "edit" | "delete" | null;
