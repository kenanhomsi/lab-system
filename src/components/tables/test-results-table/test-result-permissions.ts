import { isClinicalPatientUser } from "@/components/modals/test-requests/party-ids";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";

type TestResultPermissionFlags = {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};

/** Resolves create/update/delete flags from session roles and backend permissions. */
function getTestResultPermissions(
  roles: string[] | undefined,
  permissions: string[] | undefined,
): TestResultPermissionFlags {
  if (isClinicalPatientUser(roles)) {
    return { canCreate: false, canUpdate: false, canDelete: false };
  }

  return {
    canCreate: hasPermission(
      permissions,
      PERMISSIONS.testResults.create,
      roles,
    ),
    canUpdate: hasPermission(
      permissions,
      PERMISSIONS.testResults.update,
      roles,
    ),
    canDelete: hasPermission(
      permissions,
      PERMISSIONS.testResults.delete,
      roles,
    ),
  };
}

export { getTestResultPermissions };
export type { TestResultPermissionFlags };
