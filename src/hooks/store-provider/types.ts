export type Listener = () => void;

export type StoreApi<TState extends object> = {
  getState: () => TState;
  subscribe: (listener: Listener) => () => void;
  setState: (partial: Partial<TState>) => void;
  dispatchAction: (name: string, payload: unknown, pushId?: string) => void;
  onAction: (
    name: string,
    handler: (payload: unknown, pushId?: string) => void,
  ) => () => void;
};

export type CreateStoreFn<TState extends object, TExtras> = (
  extras: TExtras | undefined,
) => StoreApi<TState>;
