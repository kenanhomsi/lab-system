import { inject, injectable } from "inversify";
import { dashboardModuleNames } from "../names";
import { DashboardBackendClient } from "./client";
import { dashboardBackSchema } from "./transformers";
import type { GetDashboardParams } from "./types";

@injectable()
class Service {
  @inject(dashboardModuleNames.client)
  private Client: DashboardBackendClient;

  async getDashboard(params: GetDashboardParams) {
    const res = await this.Client.getDashboard(params);
    return dashboardBackSchema.parse(res);
  }
}

export { Service as DashboardBackendService };
