import { validationModuleNames, Validator } from "@/modules/validation";
import { Container } from "inversify";

const bindFront = (container: Container) => {
  container.bind(validationModuleNames.validator).to(Validator);
  return container;
};
export { bindFront as bindFrontValidatorDependencies };
