"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { SessionProvider } from "./session-provider";
import { LocaleHtmlSync } from "./locale-html-sync";
import { ThemeSync } from "./theme-sync";
import {
  MantineProvider,
  createTheme,
  rem,
  localStorageColorSchemeManager,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

const colorSchemeManager = localStorageColorSchemeManager({
  key: "color-scheme",
});

const appTheme = createTheme({
  primaryColor: "electric",
  primaryShade: { light: 6, dark: 5 },
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  headings: {
    fontFamily: "var(--font-plus-jakarta), var(--font-inter), system-ui, sans-serif",
    fontWeight: "700",
  },
  radius: {
    xs: rem(8),
    sm: rem(12),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },
  spacing: {
    xs: rem(8),
    sm: rem(12),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },
  defaultRadius: "md",
  colors: {
    electric: [
      "#eff6ff",
      "#dbeafe",
      "#bfdbfe",
      "#93c5fd",
      "#60a5fa",
      "#3b82f6",
      "#2563eb",
      "#1d4ed8",
      "#1e40af",
      "#1e3a8a",
    ],
  },
  other: {
    shadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 20px -5px rgba(0, 0, 0, 0.04), 0 20px 25px -5px rgba(0, 0, 0, 0.02)",
  },
  components: {
    Button: {
      defaultProps: {
        fw: 600,
        radius: "xl",
      },
    },
    TextInput: {
      defaultProps: {
        radius: "md",
      },
      styles: {
        input: { transition: "border-color 0.2s ease, box-shadow 0.2s ease" }
      }
    },
    Select: {
      defaultProps: {
        radius: "md",
      },
      styles: {
        input: { transition: "border-color 0.2s ease, box-shadow 0.2s ease" }
      }
    },
    Modal: {
      defaultProps: {
        radius: "xl",
        centered: true,
        overlayProps: {
          blur: 8,
        }
      },
    },
    Paper: {
      defaultProps: {
        radius: "xl",
        withBorder: true,
      },
    },
    Card: {
      defaultProps: {
        radius: "xl",
        withBorder: true,
      },
    },
  },
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
          theme={appTheme}
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
