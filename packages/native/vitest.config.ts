import { defineConfig } from "vitest/config";

/**
 * Testes rodam os componentes de verdade no DOM via react-native-web
 * (mesma API do React Native), sem simulador.
 */
export default defineConfig({
  resolve: {
    alias: { "react-native": "react-native-web" },
    extensions: [".web.tsx", ".web.ts", ".web.js", ".tsx", ".ts", ".js"]
  },
  define: { __DEV__: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"]
  }
});
