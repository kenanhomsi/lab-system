"use client";

import { MantineProvider, createTheme, localStorageColorSchemeManager } from "@mantine/core";

const colorSchemeManager = localStorageColorSchemeManager({ key: "color-scheme" });
const theme = createTheme({
  primaryColor: "cyan",
  defaultRadius: "md",
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  headings: {
    fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif",
  },
});

interface MantineThemeProviderProps {
  children: React.ReactNode;
}

export default function MantineThemeProvider({ children }: MantineThemeProviderProps) {
  return (
    <MantineProvider
      colorSchemeManager={colorSchemeManager}
      defaultColorScheme="light"
      theme={theme}
    >
      {children}
    </MantineProvider>
  );
}
