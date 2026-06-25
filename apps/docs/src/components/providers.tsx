"use client";

import { ThemeProvider } from "@aura/core/client";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
