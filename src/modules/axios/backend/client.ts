import { inject, injectable } from "inversify";
import type { AxiosInstance } from "axios";
import { BaseHttpClient } from "../abstraction/axios";
import { BACKEND_AXIOS } from "./names";

@injectable()
export class BackendHttpClient extends BaseHttpClient {
  constructor(@inject(BACKEND_AXIOS) http: AxiosInstance) {
    super(http);
  }
}
