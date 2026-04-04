import type { Listener, StoreApi } from "./types";

export function createStoreApi<TState extends object>(
  initialState: TState,
): StoreApi<TState> {
  let state = initialState;
  const listeners = new Set<Listener>();
  const actionListeners = new Map<
    string,
    Set<(payload: unknown, pushId?: string) => void>
  >();

  const notify = (): void => {
    listeners.forEach((listener) => listener());
  };

  return {
    getState: () => state,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setState: (partial) => {
      state = { ...state, ...partial };
      notify();
    },
    dispatchAction: (name, payload, pushId) => {
      const set = actionListeners.get(name);
      set?.forEach((callback) => callback(payload, pushId));
    },
    onAction: (name, handler) => {
      let set = actionListeners.get(name);
      if (!set) {
        set = new Set();
        actionListeners.set(name, set);
      }
      set.add(handler);
      return () => {
        set?.delete(handler);
      };
    },
  };
}
