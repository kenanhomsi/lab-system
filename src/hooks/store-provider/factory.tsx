"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CreateStoreFn, StoreApi } from "./types";

export function createComponentWithProvider<
  TState extends object,
  TExtras = undefined,
>(createStore: CreateStoreFn<TState, TExtras>) {
  const StoreContext = createContext<StoreApi<TState> | null>(null);
  const ExtrasContext = createContext<TExtras | undefined>(undefined);

  function Provider({
    children,
    extras,
  }: {
    children: ReactNode;
    extras?: TExtras;
  }) {
    const [store] = useState(() => createStore(extras));
    return (
      <ExtrasContext.Provider value={extras}>
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
      </ExtrasContext.Provider>
    );
  }

  function useStore<T>(selector: (state: TState) => T): T {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error("useStore must be used within its Provider");
    }
    return useSyncExternalStore(
      store.subscribe,
      () => selector(store.getState()),
      () => selector(store.getState()),
    );
  }

  function useStoreApi(): StoreApi<TState> {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error("useStoreApi must be used within its Provider");
    }
    return store;
  }

  function useSyncFrom(
    updater: (api: StoreApi<TState>) => void,
    deps: readonly unknown[],
  ): void {
    const store = useContext(StoreContext);
    const updaterRef = useRef(updater);
    updaterRef.current = updater;
    useEffect(() => {
      if (!store) {
        return;
      }
      updaterRef.current(store);
      // eslint-disable-next-line react-hooks/exhaustive-deps -- consumer controls deps array
    }, [store, ...deps]);
  }

  function useCallAction(
    name: string,
    pushId?: string,
  ): (payload: unknown) => void {
    const store = useContext(StoreContext);
    return useCallback(
      (payload: unknown) => {
        store?.dispatchAction(name, payload, pushId);
      },
      [store, name, pushId],
    );
  }

  function useSubscribeAction(
    name: string,
    handler: (payload: unknown, pushId?: string) => void,
    pushId?: string,
  ): void {
    const store = useContext(StoreContext);
    useEffect(() => {
      if (!store) {
        return undefined;
      }
      return store.onAction(name, (payload, id) => {
        if (pushId !== undefined && id !== pushId) {
          return;
        }
        handler(payload, id);
      });
    }, [store, name, handler, pushId]);
  }

  return {
    Provider,
    useStore,
    useStoreApi,
    useSyncFrom,
    useCallAction,
    useSubscribeAction,
    ExtrasContext,
    StoreContext,
  };
}
