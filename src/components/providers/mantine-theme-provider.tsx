"use client";

import { MantineProvider, localStorageColorSchemeManager } from "@mantine/core";

const colorSchemeManager = localStorageColorSchemeManager({ key: "color-scheme" });

interface MantineThemeProviderProps {
  children: React.ReactNode;
}

export default function MantineThemeProvider({ children }: MantineThemeProviderProps) {
  return (
    <MantineProvider colorSchemeManager={colorSchemeManager} defaultColorScheme="light">
      {children}
    </MantineProvider>
  );
}
