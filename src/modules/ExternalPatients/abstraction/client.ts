import { AxiosClient, AxiosModuleNames, AxiosState } from "@/modules/axios";
import { inject, injectable } from "inversify";

@injectable()
abstract class ExternalPatientsClientBase<T extends AxiosState> {
  @inject(AxiosModuleNames.client) protected axiosClient: AxiosClient<T>;

  protected getEndpoint(path: string) {
    return this.axiosClient.get({ endpoint: path });
  }

  protected postJson(path: string, body: object) {
    return this.axiosClient.post({ endpoint: path }).setBody(body);
  }
}

export { ExternalPatientsClientBase };
