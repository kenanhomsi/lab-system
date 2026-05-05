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
  bindBackPermissionDependencies,
  bindBackComplaintDependencies,
  bindBackExternalPatientsDependencies,
  bindBackTestRequestsDependencies,
  bindBackTestResultsDependencies,
  bindBackSlideCardDependencies,
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
  bindBackPermissionDependencies,
  bindBackComplaintDependencies,
)(c);

export { backendContainer };
