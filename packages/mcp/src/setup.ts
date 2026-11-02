export type SetupMode = "package" | "cli" | "native";

const NATIVE_GUIDE = `# Aura UI — React Native / Expo (aura-ui-native)

Sem dependências nativas: funciona no Expo Go e em apps bare (React Native ≥ 0.79). Mesmos 33 temas e cores do web.

## 1. Instalar

\`\`\`bash
npx expo install aura-ui-native
# opcionais p/ as variantes gradient e glass:
npx expo install expo-linear-gradient expo-blur
\`\`\`

## 2. Provider na raiz

\`\`\`tsx
import { AuraProvider } from "aura-ui-native";
import { LinearGradient } from "expo-linear-gradient"; // opcional
import { BlurView } from "expo-blur";                  // opcional

export default function App() {
  return (
    <AuraProvider theme="aura" defaultMode="system" components={{ LinearGradient, BlurView }}>
      <Home />
    </AuraProvider>
  );
}
\`\`\`

- \`theme\`: um dos 33 temas (veja \`list_themes\`); \`mode\`/\`defaultMode\`: "light" | "dark" | "system".
- Marca própria: \`overrides={{ colors: { primary: "#0ea5e9" }, radius: 16, fonts: { regular: "Inter_400Regular", bold: "Inter_700Bold" } }}\`.
- Sem \`LinearGradient\`/\`BlurView\`, as variantes \`gradient\`/\`glass\` caem em cor sólida/superfície translúcida.

## 3. Usar

\`\`\`tsx
import { Screen, VStack, Text, Button, Card, CardTitle, Input, useAura } from "aura-ui-native";

function Home() {
  const t = useAura(); // t.colors, t.space(4), t.radius.lg, t.setTheme("ocean"), t.toggleMode()
  return (
    <Screen>
      <Text variant="h1">Olá</Text>
      <Card variant="elevated"><CardTitle>Resumo</CardTitle></Card>
      <Input label="E-mail" keyboardType="email-address" />
      <Button fullWidth onPress={() => {}}>Continuar</Button>
    </Screen>
  );
}
\`\`\`

- Layout por tokens: \`<Box p={4} bg="muted" radius="lg" shadow={2}>\`, \`<HStack space={2}>\` (escala de 4px).
- Estilos próprios que seguem o tema: \`const useStyles = makeStyles((t) => ({ card: { backgroundColor: t.colors.surface } }))\`.
- Componentes: \`list_components\` com \`category: "native"\`; API e código: \`get_component\` com \`platform: "native"\`.`;
export type Framework = "next" | "vite" | "other";

const tailwindStep: Record<Framework, string> = {
  next: `\`\`\`bash
pnpm add -D @tailwindcss/postcss
\`\`\`

\`postcss.config.mjs\`:

\`\`\`js
export default { plugins: { "@tailwindcss/postcss": {} } };
\`\`\``,
  vite: `\`\`\`bash
pnpm add -D @tailwindcss/vite
\`\`\`

\`vite.config.ts\`:

\`\`\`ts
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({ plugins: [react(), tailwindcss()] });
\`\`\``,
  other:
    "Configure o Tailwind CSS v4 do seu bundler (`@tailwindcss/postcss`, `@tailwindcss/vite` ou `@tailwindcss/cli`)."
};

const cssFile: Record<Framework, string> = {
  next: "app/globals.css",
  vite: "src/index.css",
  other: "o CSS global do app"
};

const themeStep: Record<Framework, string> = {
  next: `\`ThemeProvider\` é client component: crie \`app/providers.tsx\` com \`"use client"\` e use-o no \`layout.tsx\` envolvendo \`{children}\`.

\`\`\`tsx
"use client";
import { ThemeProvider } from "aura-ui-core/client";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider defaultTheme="system" defaultColorScheme="aura">{children}</ThemeProvider>;
}
\`\`\``,
  vite: `\`\`\`tsx
import { ThemeProvider } from "aura-ui-core/client";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" defaultColorScheme="aura">
    <App />
  </ThemeProvider>
);
\`\`\``,
  other: `Envolva o app em \`<ThemeProvider>\` de \`aura-ui-core/client\`, ou só defina \`data-theme\` no \`<html>\`.`
};

export function setupGuide(mode: SetupMode, framework: Framework): string {
  if (mode === "native") return NATIVE_GUIDE;
  if (mode === "cli") {
    return `# Aura UI — modo CLI (código copiado p/ o seu repo, estilo shadcn)

Use quando quiser editar os componentes. Os arquivos vão para \`src/components/ui\`, \`src/components/effects\` e \`src/lib\`.

## 1. Tailwind CSS v4

${tailwindStep[framework]}

## 2. Inicializar

\`\`\`bash
npx aura-ui-cli init
pnpm add aura-ui-core aura-ui-tailwind class-variance-authority tailwindcss
\`\`\`

O \`init\` cria \`aura.config.json\` e \`src/styles/aura-tokens.css\`. Em ${cssFile[framework]}, **troque** \`@import "tailwindcss"\` por um import desse arquivo (o preset já inclui o Tailwind).

## 3. Adicionar componentes

\`\`\`bash
npx aura-ui-cli add button card dialog
\`\`\`

O \`add\` resolve as dependências entre componentes e imprime o \`pnpm add\` com os pacotes npm necessários (ex.: \`@radix-ui/react-dialog\`) — instale-os.

## 4. Usar

\`\`\`tsx
import { Button } from "@/components/ui/button"; // ou caminho relativo
\`\`\`

Componentes copiados ficam no \`src/\`, então o Tailwind os detecta sozinho (não precisa de \`@source\`).

## Tema

${themeStep[framework]}

Tema nomeado: \`<html data-theme="ocean">\` (33 temas — veja \`list_themes\`).`;
  }

  return `# Aura UI — modo pacote (npm)

Use para consumir os componentes prontos e receber atualizações via npm.

## 1. Instalar

\`\`\`bash
pnpm add aura-ui-components aura-ui-core aura-ui-tailwind tailwindcss
# opcionais: aura-ui-effects (efeitos 3D/motion) · aura-ui-three three @react-three/fiber (WebGL)
\`\`\`

## 2. Tailwind CSS v4

${tailwindStep[framework]}

## 3. CSS global

Em ${cssFile[framework]}, **no lugar** de \`@import "tailwindcss"\`:

\`\`\`css
@import "aura-ui-tailwind";                /* Tailwind + tokens + primitivas 3D + temas */
@import "aura-ui-components/tailwind.css"; /* registra as classes dos componentes */
@import "aura-ui-effects/tailwind.css";    /* só se usar aura-ui-effects */
\`\`\`

O Tailwind v4 não escaneia \`node_modules\`: sem o \`tailwind.css\` de cada pacote, os componentes aparecem sem estilo.

## 4. Tema

${themeStep[framework]}

Tema nomeado: \`<html data-theme="ocean">\` (33 temas — veja \`list_themes\`). Modo escuro: classe \`.dark\` no \`<html>\` ou um tema escuro.

## 5. Usar

\`\`\`tsx
import { Button, Card, CardHeader, CardTitle } from "aura-ui-components";
// ou por componente (melhor tree-shaking):
import { DatePicker } from "aura-ui-components/date-picker";
\`\`\`

Componentes interativos já têm \`"use client"\`; podem ser usados dentro de Server Components.`;
}
