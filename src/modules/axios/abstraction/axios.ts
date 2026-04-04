import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export abstract class BaseHttpClient {
  constructor(protected readonly http: AxiosInstance) {}

  protected get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.http.get<T>(url, config);
  }

  protected post<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.http.post<T>(url, body, config);
  }

  protected patch<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.http.patch<T>(url, body, config);
  }

  protected delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.http.delete<T>(url, config);
  }
}
