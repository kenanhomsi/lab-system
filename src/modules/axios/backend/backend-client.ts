import { AxiosClient } from "@/modules/axios/abstraction/axios";
import { AxiosModuleNames } from "@/modules/axios/names";
import { BackendState } from "@/modules/axios/backend/backend-state";
import { inject, injectable, injectFromBase } from "inversify";
import { axiosInstanceBack } from "@/lib/clients/backend-instance";

@injectable()
@injectFromBase({ extendProperties: true })
class BackendClient extends AxiosClient<BackendState> {
  constructor(@inject(AxiosModuleNames.state) state: BackendState) {
    state.setInstance(axiosInstanceBack);
    super({ state });
  }
}
export { BackendClient };
