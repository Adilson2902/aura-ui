import * as React from "react";
import type { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { useAura, type AuraTheme } from "./provider";

type NamedStyles<T> = { [K in keyof T]: ViewStyle | TextStyle | ImageStyle };

/**
 * Cria um hook de estilos que reage ao tema (cores, modo, raio…):
 *
 * const useStyles = makeStyles((t) => ({
 *   card: { backgroundColor: t.colors.surface, borderRadius: t.radius.lg, padding: t.space(4) }
 * }));
 * function Perfil() { const s = useStyles(); return <View style={s.card} />; }
 */
export function makeStyles<T extends NamedStyles<T>>(factory: (theme: AuraTheme) => T) {
  return function useStyles(): T {
    const theme = useAura();
    return React.useMemo(() => factory(theme), [theme]);
  };
}

/** Versão inline de `makeStyles`: `const s = useStyles((t) => ({ … }), [deps])`. */
export function useStyles<T extends NamedStyles<T>>(
  factory: (theme: AuraTheme) => T,
  deps: React.DependencyList = []
): T {
  const theme = useAura();
  // `factory` costuma ser inline; as dependências reais vêm de `deps`
  return React.useMemo(() => factory(theme), [theme, ...deps]);
}
