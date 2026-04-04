import { Container } from "inversify";
import type { AxiosInstance } from "axios";
import { createBackendAxios } from "@/lib/clients/backend-instance";
import { BACKEND_AXIOS } from "@/modules/axios/backend/names";
import { BackendHttpClient } from "@/modules/axios/backend/client";

export function bindAxiosBackend(container: Container): Container {
  container
    .bind<AxiosInstance>(BACKEND_AXIOS)
    .toConstantValue(createBackendAxios());
  container.bind(BackendHttpClient).toSelf().inSingletonScope();
  return container;
}
