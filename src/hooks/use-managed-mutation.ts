"use client";

import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { extractErrorMessage } from "@/lib/error";
import { useMutationError } from "@/hooks/mutation-error-context";

export function useManagedMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TOnMutateResult = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TOnMutateResult>,
): UseMutationResult<TData, TError, TVariables, TOnMutateResult> {
  const { addError, clearErrors } = useMutationError();

  return useMutation({
    ...options,
    onMutate: async (variables, mutateContext) => {
      clearErrors();
      return options.onMutate?.(variables, mutateContext);
    },
    onError: (error, variables, onMutateResult, mutateContext) => {
      addError(extractErrorMessage(error));
      options.onError?.(error, variables, onMutateResult, mutateContext);
    },
    onSuccess: (data, variables, onMutateResult, mutateContext) => {
      clearErrors();
      options.onSuccess?.(
        data,
        variables,
        onMutateResult as TOnMutateResult,
        mutateContext,
      );
    },
    onSettled: (data, error, variables, onMutateResult, mutateContext) => {
      options.onSettled?.(data, error, variables, onMutateResult, mutateContext);
    },
  }) as UseMutationResult<TData, TError, TVariables, TOnMutateResult>;
}
