import { Container } from "inversify";
import { container } from "./container";
import { pipe } from "ramda";
import {
  bindFrontAuthDependencies,
  bindFrontAxiosDependencies,
  bindFrontBannerDependencies,
  bindFrontComplaintDependencies,
  bindFrontExternalPatientsDependencies,
  bindFrontEventDependencies,
  bindFrontAccessPolicyDependencies,
  bindFrontRoleDependencies,
  bindFrontSubscriptionPackageDependencies,
  bindFrontUserDependencies,
  bindFrontValidatorDependencies,
  bindFrontMedicalTestDependencies,
  bindFrontTestRequestsDependencies,
  bindFrontTestResultsDependencies,
  bindFrontSlideCardDependencies,
  bindFrontDashboardDependencies,
} from "./bindings";

const c = new Container({ parent: container });
const frontendContainer = pipe(
  bindFrontExternalPatientsDependencies,
  bindFrontTestRequestsDependencies,
  bindFrontTestResultsDependencies,
  bindFrontSlideCardDependencies,
  bindFrontMedicalTestDependencies,
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
  bindFrontDashboardDependencies,
)(c);

export { frontendContainer };
