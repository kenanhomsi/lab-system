/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AxiosInstance,
  AxiosProgressEvent,
  AxiosResponse,
  ResponseType,
} from "axios";
import { isEmpty } from "ramda";
class State {
  protected headers: Record<string, string> = {};
  protected query: Record<string, string> = {};
  private method: "get" | "post" | "put" | "patch" | "delete";
  private body: object | FormData = {};
  private formData: FormData = new FormData();
  private endpoint: string;
  protected instance: AxiosInstance;
  private responseType: ResponseType = "json";
  private onUpload?: (progressEvent: AxiosProgressEvent) => void;
  private resetRequestState() {
    this.headers = {};
    this.query = {};
    this.body = {};
    this.formData = new FormData();
    this.responseType = "json";
    this.onUpload = undefined;
  }
  setInstance(instance: AxiosInstance) {
    this.instance = instance;
  }
  withFilters(filters?: Record<string, any>) {
    this.query = { ...this.query, filters: JSON.stringify(filters) };
    return this;
  }
  withPagination(params?: { page: number; limit: number } | object) {
    this.query = { ...this.query, pagination: JSON.stringify(params) };
    return this;
  }
  withInclude(include: Record<string, any>) {
    this.query = { ...this.query, include: JSON.stringify(include) };
    return this;
  }
  // withInclude(include: string[]) {
  //   const o = include.reduce((pre, curr) => ({ ...pre, [curr]: true }), {});
  //   this.query = { ...this.query, include: JSON.stringify(o) };
  //   return this;
  // }
  withQuery(queryParams?: Record<string, any>) {
    if (queryParams) {
      this.query = { ...this.query, ...queryParams };
    }
    return this;
  }
  setMethod(method: "get" | "post" | "put" | "patch" | "delete") {
    this.resetRequestState();
    this.method = method;
    return this;
  }
  setBody(body: object | FormData) {
    this.body = body;
    return this;
  }
  appendFile(key: string, file: File) {
    this.formData.set(key, file);
    return this;
  }
  setEndpoint(endpoint: string) {
    this.endpoint = endpoint;
    return this;
  }
  setResponseType(type: ResponseType) {
    this.responseType = type;
    this.headers = {};
    return this;
  }
  setOnUpload(onUpload: (progressEvent: AxiosProgressEvent) => void) {
    this.onUpload = onUpload;
    return this;
  }
  private hasRequestBody(): boolean {
    if (this.body instanceof FormData) {
      return [...this.body.keys()].length > 0;
    }
    return !isEmpty(this.body);
  }

  async perform<T = any>(): Promise<AxiosResponse<T>> {
    try {
      if (this.method === "get") {
        return this.instance.get(this.endpoint, {
          headers: this.headers,
          params: this.query,
          responseType: this.responseType,
        });
      }
      if (this.method === "delete" && !this.hasRequestBody()) {
        return this.instance.delete(this.endpoint, {
          headers: this.headers,
          params: this.query,
          responseType: this.responseType,
        });
      }
      if (this.method === "delete" && this.hasRequestBody()) {
        const body =
          this.body instanceof FormData ? this.body : (this.body as object);
        return this.instance.delete(this.endpoint, {
          data: body,
          headers: this.headers,
          params: this.query,
          responseType: this.responseType,
        });
      }
      const body =
        this.body instanceof FormData
          ? this.body
          : this.method === "patch" && isEmpty(this.body)
            ? {}
            : isEmpty(this.body)
              ? this.formData
              : this.body;
      return this.instance[this.method](this.endpoint, body, {
        headers: this.headers,
        params: this.query,
        responseType: this.responseType,
        onUploadProgress: this.onUpload,
      });
    } finally {
      this.resetRequestState();
    }
  }
}
export { State as AxiosState };
