"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { createAppQueryClient } from "@/lib/query/create-query-client";
import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";
import { SessionProvider } from "./session-provider";
import { LocaleHtmlSync } from "./locale-html-sync";
import { ErrorI18nSync } from "./error-i18n-sync";

const MantineRouteProvider = dynamic(
  () =>
    import("./mantine-route-provider").then((m) => ({
      default: m.MantineRouteProvider,
    })),
  { ssr: true },
);

/** Client providers for auth routes (login, register, forgot-password). */
export function AuthProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createAppQueryClient());

  return (
    <SessionProvider>
      <LocaleHtmlSync />
      <ErrorI18nSync />
      <QueryClientProvider client={queryClient}>
        <MantineRouteProvider>{children}</MantineRouteProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
