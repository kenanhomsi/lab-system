import {
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import { showErrorNotification } from "@/lib/error";
import { getErrorLabels } from "@/lib/error/error-labels";

export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        const { fetchErrorTitle } = getErrorLabels();
        showErrorNotification(fetchErrorTitle, error);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        const { operationFailedTitle } = getErrorLabels();
        showErrorNotification(operationFailedTitle, error);
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 1,
      },
    },
  });
}
