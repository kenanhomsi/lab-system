import { hasPatientRole } from "@/components/profile/role-path";

/** Patients stay on the public profile shell; staff use the dashboard notifications page. */
export function getNotificationsViewAllHref(roles?: string[]): string {
  return hasPatientRole(roles) ? "/profile?tab=notifications" : "/notifications";
}
