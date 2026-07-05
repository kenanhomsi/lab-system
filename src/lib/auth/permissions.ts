/** Permission keys returned by the auth API (resource.action, snake_case). */
const PERMISSIONS = {
  testResults: {
    create: "test_results.create",
    read: "test_results.read",
    update: "test_results.update",
    delete: "test_results.delete",
  },
} as const;

type ParsedPermission = {
  resource: string;
  action: string;
};

function hasAdminRole(roles: string[] | undefined): boolean {
  return (
    roles?.some((role) => {
      const normalized = role.trim().toLowerCase();
      return normalized === "admin" || normalized.includes("admin");
    }) ?? false
  );
}

function parsePermission(value: string): ParsedPermission | null {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;

  const separator = normalized.includes(":") ? ":" : ".";
  const parts = normalized.split(separator);
  if (parts.length !== 2) return null;

  const resource = parts[0]?.trim();
  const action = parts[1]?.trim();
  if (!resource || !action) return null;

  return { resource, action };
}

function permissionMatches(
  granted: ParsedPermission,
  required: ParsedPermission,
): boolean {
  const resourceMatches =
    granted.resource === "*" || granted.resource === required.resource;
  const actionMatches =
    granted.action === "*" ||
    granted.action === "manage" ||
    granted.action === required.action;

  return resourceMatches && actionMatches;
}

/** Returns true when the user has the required permission (supports wildcards and manage). */
function hasPermission(
  permissions: string[] | undefined,
  required: string,
  roles?: string[] | undefined,
): boolean {
  if (hasAdminRole(roles)) return true;

  const requiredPermission = parsePermission(required);
  if (!requiredPermission || !permissions?.length) return false;

  return permissions.some((raw) => {
    const normalized = raw.trim().toLowerCase();
    if (!normalized) return false;
    if (normalized === "*" || normalized === "admin") return true;

    const granted = parsePermission(normalized);
    if (!granted) return false;

    return permissionMatches(granted, requiredPermission);
  });
}

export { PERMISSIONS, hasAdminRole, hasPermission };
