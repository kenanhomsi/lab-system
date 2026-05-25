"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type MutationErrorContextValue = {
  error: string | null;
  addError: (message: string) => void;
  clearErrors: () => void;
};

const MutationErrorContext = createContext<MutationErrorContextValue | null>(
  null,
);

export function MutationErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  const addError = useCallback((message: string) => {
    setError(message);
  }, []);

  const clearErrors = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({ error, addError, clearErrors }),
    [error, addError, clearErrors],
  );

  return (
    <MutationErrorContext.Provider value={value}>
      {children}
    </MutationErrorContext.Provider>
  );
}

export function useMutationError(): MutationErrorContextValue {
  const context = useContext(MutationErrorContext);
  if (!context) {
    return {
      error: null,
      addError: () => undefined,
      clearErrors: () => undefined,
    };
  }
  return context;
}
