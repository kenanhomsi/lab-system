import { Container } from "inversify";
import {
  complaintModuleNames,
  ComplaintBackendClient,
  ComplaintBackendService,
  ComplaintFrontendClient,
  ComplaintFrontendService,
} from "@/modules/complaint";

const bindFront = (container: Container) => {
  container.bind(complaintModuleNames.client).to(ComplaintFrontendClient);
  container.bind(complaintModuleNames.service).to(ComplaintFrontendService);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(complaintModuleNames.client).to(ComplaintBackendClient);
  container.bind(complaintModuleNames.service).to(ComplaintBackendService);
  return container;
};

export {
  bindBack as bindBackComplaintDependencies,
  bindFront as bindFrontComplaintDependencies,
};
