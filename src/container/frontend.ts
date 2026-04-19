import { Container } from "inversify";
import { container } from "./container";
import { pipe } from "ramda";
import {
  bindFrontAppointmentDependencies,
  bindFrontAppointmentTypeDependencies,
  bindFrontAuthDependencies,
  bindFrontAxiosDependencies,
  bindFrontComplaintDependencies,
  bindFrontEventDependencies,
  bindFrontPermissionDependencies,
  bindFrontRoleDependencies,
  bindFrontSubscriptionPackageDependencies,
  bindFrontUserDependencies,
  bindFrontValidatorDependencies,
} from "./bindings";

const c = new Container({ parent: container });
const frontendContainer = pipe(
  bindFrontAxiosDependencies,
  bindFrontEventDependencies,
  bindFrontAuthDependencies,
  bindFrontValidatorDependencies,
  bindFrontUserDependencies,
  bindFrontSubscriptionPackageDependencies,
  bindFrontRoleDependencies,
  bindFrontPermissionDependencies,
  bindFrontAppointmentTypeDependencies,
  bindFrontComplaintDependencies,
  bindFrontAppointmentDependencies,
)(c);

export { frontendContainer };
