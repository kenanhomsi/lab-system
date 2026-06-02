import { Container } from "inversify";
import {
  insuranceApprovalRequestModuleNames,
  InsuranceApprovalRequestBackendClient,
  InsuranceApprovalRequestBackendService,
  InsuranceApprovalRequestFrontendClient,
  InsuranceApprovalRequestFrontendService,
} from "@/modules/insurance-approval-request";

const bindFront = (container: Container) => {
  container
    .bind(insuranceApprovalRequestModuleNames.client)
    .to(InsuranceApprovalRequestFrontendClient);
  container
    .bind(insuranceApprovalRequestModuleNames.service)
    .to(InsuranceApprovalRequestFrontendService);
  return container;
};

const bindBack = (container: Container) => {
  container
    .bind(insuranceApprovalRequestModuleNames.client)
    .to(InsuranceApprovalRequestBackendClient);
  container
    .bind(insuranceApprovalRequestModuleNames.service)
    .to(InsuranceApprovalRequestBackendService);
  return container;
};

export {
  bindBack as bindBackInsuranceApprovalRequestDependencies,
  bindFront as bindFrontInsuranceApprovalRequestDependencies,
};
