import { Container } from "inversify";
import { container } from "./container";
import { pipe } from "ramda";
import { bindBackAxiosDependencies } from "./bindings/axios-dependencies";
import { bindBackAuthDependencies } from "./bindings/auth-dependencies";
import { bindBackUserDependencies } from "./bindings/user-dependencies";
import { bindBackSubscriptionPackageDependencies } from "./bindings/subscription-package-dependencies";
import { bindBackRoleDependencies } from "./bindings/role-dependencies";
import { bindBackPermissionDependencies } from "./bindings/permission-dependencies";
import { bindBackAppointmentTypeDependencies } from "./bindings/appointment-type-dependencies";
import { bindBackComplaintDependencies } from "./bindings/complaint-dependencies";
import { bindBackAppointmentDependencies } from "./bindings/appointment-dependencies";

const c = new Container({ parent: container });
const backendContainer = pipe(
  bindBackAxiosDependencies,
  bindBackAuthDependencies,
  bindBackUserDependencies,
  bindBackSubscriptionPackageDependencies,
  bindBackRoleDependencies,
  bindBackPermissionDependencies,
  bindBackAppointmentTypeDependencies,
  bindBackComplaintDependencies,
  bindBackAppointmentDependencies,
)(c);

export { backendContainer };
