import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
import { DashboardClient } from "../abstraction";
import { DashboardResponse } from "../abstraction/schemas";
import { endpoint } from "./endpoint";
import type { GetDashboardParams } from "./types";

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends DashboardClient<BackendState> {
  async getDashboard(params: GetDashboardParams) {
    const { token } = params;
    const res = await super
      .sharedFindAll({ endpoint: endpoint.getDashboard })
      .withAuth(token)
      .perform<DashboardResponse>();
    return res.data;
  }
}

export { Client as DashboardBackendClient };
