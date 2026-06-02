import { Container } from "inversify";
import { container } from "./container";
import { pipe } from "ramda";
import {
  bindFrontAuthDependencies,
  bindFrontAxiosDependencies,
  bindFrontBannerDependencies,
  bindFrontComplaintDependencies,
  bindFrontInsuranceApprovalRequestDependencies,
  bindFrontExternalPatientsDependencies,
  bindFrontEventDependencies,
  bindFrontAccessPolicyDependencies,
  bindFrontRoleDependencies,
  bindFrontSubscriptionPackageDependencies,
  bindFrontUserDependencies,
  bindFrontValidatorDependencies,
  bindFrontMedicalTestDependencies,
  bindFrontVacantJobDependencies,
  bindFrontTestRequestsDependencies,
  bindFrontTestResultsDependencies,
  bindFrontSlideCardDependencies,
  bindFrontDashboardDependencies,
  bindFrontNotificationsDependencies,
  bindFrontAccountingDependencies,
  bindFrontSpecialAccountDependencies,
  bindFrontStoreDependencies,
} from "./bindings";

const c = new Container({ parent: container });
const frontendContainer = pipe(
  bindFrontExternalPatientsDependencies,
  bindFrontTestRequestsDependencies,
  bindFrontTestResultsDependencies,
  bindFrontSlideCardDependencies,
  bindFrontMedicalTestDependencies,
  bindFrontVacantJobDependencies,
  bindFrontBannerDependencies,
  bindFrontAxiosDependencies,
  bindFrontEventDependencies,
  bindFrontAuthDependencies,
  bindFrontValidatorDependencies,
  bindFrontUserDependencies,
  bindFrontSubscriptionPackageDependencies,
  bindFrontRoleDependencies,
  bindFrontAccessPolicyDependencies,
  bindFrontComplaintDependencies,
  bindFrontInsuranceApprovalRequestDependencies,
  bindFrontDashboardDependencies,
  bindFrontNotificationsDependencies,
  bindFrontAccountingDependencies,
  bindFrontSpecialAccountDependencies,
  bindFrontStoreDependencies,
)(c);

export { frontendContainer };
