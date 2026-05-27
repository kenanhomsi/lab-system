import { inject, injectable } from "inversify";
import { dashboardModuleNames } from "../names";
import { DashboardFrontendClient } from "./client";
import type { GetDashboardFrontendParams } from "./types";

@injectable()
class Service {
  @inject(dashboardModuleNames.client)
  private Client: DashboardFrontendClient;

  async getDashboard(params: GetDashboardFrontendParams = {}) {
    const res = await this.Client.getDashboard(params);
    return res;
  }
}

export { Service as DashboardFrontendService };
