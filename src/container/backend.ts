import { Container } from "inversify";
import { container } from "./container";
import { pipe } from "ramda";
import {
  bindBackAxiosDependencies,
  bindBackBannerDependencies,
  bindBackMedicalTestDependencies,
  bindBackVacantJobDependencies,
  bindBackAuthDependencies,
  bindBackUserDependencies,
  bindBackSubscriptionPackageDependencies,
  bindBackRoleDependencies,
  bindBackAccessPolicyDependencies,
  bindBackComplaintDependencies,
  bindBackInsuranceApprovalRequestDependencies,
  bindBackExternalPatientsDependencies,
  bindBackTestRequestsDependencies,
  bindBackTestResultsDependencies,
  bindBackSlideCardDependencies,
  bindBackDashboardDependencies,
  bindBackNotificationsDependencies,
  bindBackAccountingDependencies,
  bindBackSpecialAccountDependencies,
  bindBackStoreDependencies,
} from "./bindings";

const c = new Container({ parent: container });
const backendContainer = pipe(
  bindBackExternalPatientsDependencies,
  bindBackTestRequestsDependencies,
  bindBackTestResultsDependencies,
  bindBackSlideCardDependencies,
  bindBackMedicalTestDependencies,
  bindBackVacantJobDependencies,
  bindBackBannerDependencies,
  bindBackAxiosDependencies,
  bindBackAuthDependencies,
  bindBackUserDependencies,
  bindBackSubscriptionPackageDependencies,
  bindBackRoleDependencies,
  bindBackAccessPolicyDependencies,
  bindBackComplaintDependencies,
  bindBackInsuranceApprovalRequestDependencies,
  bindBackDashboardDependencies,
  bindBackNotificationsDependencies,
  bindBackAccountingDependencies,
  bindBackSpecialAccountDependencies,
  bindBackStoreDependencies,
)(c);

export { backendContainer };
