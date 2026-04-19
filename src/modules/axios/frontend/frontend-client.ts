import { AxiosClient } from "@/modules/axios/abstraction/axios";
import { AxiosModuleNames } from "@/modules/axios/names";
import { inject, injectable, injectFromBase } from "inversify";
import { AxiosState } from "../abstraction";
import { axiosInstanceFront } from "@/lib/clients/frontend-instance";
import { FrontendState } from "./frontend-state";

@injectable()
@injectFromBase({ extendProperties: true })
class FrontendClient extends AxiosClient<AxiosState> {
  constructor(@inject(AxiosModuleNames.state) state: FrontendState) {
    state.setInstance(axiosInstanceFront);
    super({ state });
  }
}
export { FrontendClient };
