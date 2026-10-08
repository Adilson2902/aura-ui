import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aura UI — Componentes modernos, interações reais",
  description:
    "Explore componentes React, efeitos de profundidade, formulários e tabelas interativas. Prévias funcionais e exemplos de código para criar do seu jeito."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
