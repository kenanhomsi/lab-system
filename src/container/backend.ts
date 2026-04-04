import { Container } from "inversify";
import { container } from "./container";
import { pipe } from "ramda";
import { bindProjectsBackend } from "./bindings/projects-backend";
import { bindAxiosBackend } from "./bindings/axios-backend";

const c = new Container({ parent: container });
const backendContainer = pipe(
bindAxiosBackend, bindProjectsBackend
)(c);
export { backendContainer };
