import { Container } from "inversify";
import type { AxiosInstance } from "axios";
import { createFrontendAxios } from "@/lib/clients/frontend-instance";
import { FRONTEND_AXIOS } from "@/modules/axios/frontend/names";
import { FrontendHttpClient } from "@/modules/axios/frontend/client";

export function bindAxiosFrontend(container: Container): Container {
  container
    .bind<AxiosInstance>(FRONTEND_AXIOS)
    .toConstantValue(createFrontendAxios());
  container.bind(FrontendHttpClient).toSelf().inSingletonScope();
  return container;
}
