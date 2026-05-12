import { injectable, unmanaged } from "inversify";
import { AxiosState } from "./state";

type ConstructorParams<T> = {
  state: T;
};

@injectable()
class Abstraction<T extends AxiosState> {
  protected state: T;
  constructor(@unmanaged() params: ConstructorParams<T>) {
    const { state } = params;
    this.state = state;
  }

  get(params: { endpoint: string }) {
    const { endpoint } = params;
    this.state.setMethod("get").setEndpoint(endpoint);
    return this.state;
  }
  post(params: { endpoint: string }) {
    const { endpoint } = params;
    this.state.setMethod("post").setEndpoint(endpoint);
    return this.state;
  }
  put(params: { endpoint: string }) {
    const { endpoint } = params;
    this.state.setMethod("put").setEndpoint(endpoint);
    return this.state;
  }
  patch(params: { endpoint: string }) {
    const { endpoint } = params;
    this.state.setMethod("patch").setEndpoint(endpoint);
    return this.state;
  }
  delete(params: { endpoint: string }) {
    const { endpoint } = params;
    this.state.setMethod("delete").setEndpoint(endpoint);
    return this.state;
  }
}

export { Abstraction as AxiosClient };
