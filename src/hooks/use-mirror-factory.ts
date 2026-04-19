"use client";
import { create } from "zustand";
import { useCompareEffect } from "./use-compare-effect-v2";
const mirrorFactory = <T extends object>(store: T) => {
  const internalStore = create<T>(() => ({ ...store }));
  const useMirrorRegistry = <U extends keyof T>(
    state: U,
    params: T[U],
    type: "value" | "reference" = "reference",
  ) => {
    useCompareEffect(type)(() => {
      internalStore.setState((s) => ({ ...s, [state]: params }));
    }, [params]);
    return params;
  };

  const useMirror = <U extends keyof T>(state: U): T[U] => {
    const value = internalStore((s) => s[state]);

    return value;
  };

  return { useMirror, useMirrorRegistry };
};
export { mirrorFactory };
