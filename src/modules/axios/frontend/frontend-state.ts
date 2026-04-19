import { inject, injectable, injectFromBase } from "inversify";
import { AxiosState } from "../abstraction";
import { AxiosResponse } from "axios";
import { eventModuleNames, EventService } from "@/modules/events";
@injectable()
@injectFromBase({ extendProperties: true })
class FrontendState extends AxiosState {
  @inject(eventModuleNames.service) private eventService: EventService;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  async perform<T = any>(): Promise<AxiosResponse<T>> {
    try {
      const res = await super.perform<T>();
      return res;
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const message = e.response?.data?.message || "Something went wrong";

      this.eventService.emit("apiError", { message });
      throw e;
    }
  }
}
export { FrontendState };
