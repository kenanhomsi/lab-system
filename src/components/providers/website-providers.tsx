"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";
import { LocaleHtmlSync } from "./locale-html-sync";

const MantineRouteProvider = dynamic(
  () =>
    import("./mantine-route-provider").then((m) => ({
      default: m.MantineRouteProvider,
    })),
  { ssr: true },
);

/** Minimal client providers for public website routes. */
export function WebsiteProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
            refetchOnReconnect: true,
          },
        },
      }),
  );

  return (
    <>
      <LocaleHtmlSync />
      <QueryClientProvider client={queryClient}>
        <MantineRouteProvider>{children}</MantineRouteProvider>
      </QueryClientProvider>
    </>
  );
}
