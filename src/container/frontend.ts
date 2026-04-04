import { Container } from "inversify";
import { container } from "./container";
import { pipe } from "ramda";
import { bindAxiosFrontend } from "./bindings/axios-frontend";
import { bindProjectsFrontend } from "./bindings/projects-frontend";
import { bindEventsFrontend } from "./bindings/events-frontend";

const c = new Container({ parent: container });
const frontendContainer = pipe(
bindAxiosFrontend, bindProjectsFrontend, bindEventsFrontend
)(c);
  
export { frontendContainer };
