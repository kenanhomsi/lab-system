"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { SessionProvider } from "./session-provider";
import { LocaleHtmlSync } from "./locale-html-sync";
import { ThemeSync } from "./theme-sync";
import {
  MantineProvider,
  createTheme,
  localStorageColorSchemeManager,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

const colorSchemeManager = localStorageColorSchemeManager({
  key: "color-scheme",
});

export function AppProviders({ children }: { children: ReactNode }) {
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
        <MantineProvider
          theme={createTheme({
            primaryColor: "cyan",
            colors: {
              dark: [
                "#e5e2e1", // [0] primary text
                "#bdc8ce", // [1] dimmed text
                "#879298", // [2] subtle / placeholder
                "#3e484d", // [3] disabled state
                "#2a2a2a", // [4] borders
                "#201f1f", // [5] hover surface
                "#1c1b1b", // [6] paper / card / input bg
                "#131313", // [7] body bg
                "#0e0e0e", // [8] deepest surface
                "#0a0a0a", // [9] absolute darkest
              ],
            },
          })}
          colorSchemeManager={colorSchemeManager}
          defaultColorScheme="light"
        >
          <ThemeSync />
          <Notifications position="top-right" />
          <ModalsProvider>{children}</ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
