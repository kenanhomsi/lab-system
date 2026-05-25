"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";
import { SessionProvider } from "./session-provider";
import { LocaleHtmlSync } from "./locale-html-sync";

const MantineRouteProvider = dynamic(
  () =>
    import("./mantine-route-provider").then((m) => ({
      default: m.MantineRouteProvider,
    })),
  { ssr: true },
);

/** Full client providers for dashboard routes. */
export function DashboardProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <SessionProvider>
      <LocaleHtmlSync />
      <QueryClientProvider client={queryClient}>
        <MantineRouteProvider>{children}</MantineRouteProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
