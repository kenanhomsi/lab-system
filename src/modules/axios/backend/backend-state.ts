import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "../abstraction/state";

@injectable()
@injectFromBase({ extendProperties: true })
class BackendState extends AxiosState {
  withAuth(token: string) {
    this.headers = { ...this.headers, Authorization: `Bearer ${token}` };
    return this;
  }
}
export { BackendState };
