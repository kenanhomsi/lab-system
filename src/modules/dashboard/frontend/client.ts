import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
import { DashboardClient } from "../abstraction";
import { DashboardResponse } from "../abstraction/schemas";
import { endpoint } from "./endpoint";
import type { GetDashboardFrontendParams } from "./types";

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends DashboardClient<AxiosState> {
  async getDashboard(_params: GetDashboardFrontendParams) {
    void _params;
    const res = await super
      .sharedFindAll({ endpoint: endpoint.getDashboard })
      .perform<DashboardResponse>();
    return res.data;
  }
}

export { Client as DashboardFrontendClient };
