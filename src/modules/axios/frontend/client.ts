import { inject, injectable } from "inversify";
import type { AxiosInstance } from "axios";
import { BaseHttpClient } from "../abstraction/axios";
import { FRONTEND_AXIOS } from "./names";

@injectable()
export class FrontendHttpClient extends BaseHttpClient {
  constructor(@inject(FRONTEND_AXIOS) http: AxiosInstance) {
    super(http);
  }
}
