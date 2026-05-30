import { Container } from "inversify";
import { container } from "./container";
import { pipe } from "ramda";
import {
  bindBackAxiosDependencies,
  bindBackBannerDependencies,
  bindBackMedicalTestDependencies,
  bindBackAuthDependencies,
  bindBackUserDependencies,
  bindBackSubscriptionPackageDependencies,
  bindBackRoleDependencies,
  bindBackAccessPolicyDependencies,
  bindBackComplaintDependencies,
  bindBackExternalPatientsDependencies,
  bindBackTestRequestsDependencies,
  bindBackTestResultsDependencies,
  bindBackSlideCardDependencies,
  bindBackDashboardDependencies,
  bindBackNotificationsDependencies,
} from "./bindings";

const c = new Container({ parent: container });
const backendContainer = pipe(
  bindBackExternalPatientsDependencies,
  bindBackTestRequestsDependencies,
  bindBackTestResultsDependencies,
  bindBackSlideCardDependencies,
  bindBackMedicalTestDependencies,
  bindBackBannerDependencies,
  bindBackAxiosDependencies,
  bindBackAuthDependencies,
  bindBackUserDependencies,
  bindBackSubscriptionPackageDependencies,
  bindBackRoleDependencies,
  bindBackAccessPolicyDependencies,
  bindBackComplaintDependencies,
  bindBackDashboardDependencies,
  bindBackNotificationsDependencies,
)(c);

export { backendContainer };
