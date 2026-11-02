---
"aura-ui-core": patch
---

Temas escuros mantêm a própria superfície com `.dark`

- **Fix**: ao escolher `midnight`, `cyber`, `synthwave`, `matrix`, `volcano`, `grape`, `obsidian` ou `terminal` pelo `ThemeProvider`, a classe `.dark` no `<html>` sobrescrevia `--aura-surface`, `--aura-muted`, `--aura-border` e os foregrounds do tema com o escuro genérico. Os blocos desses temas agora também casam com `.dark[data-theme="…"]` e vencem o `.dark` genérico; temas claros no modo escuro continuam iguais
- `registry/lib/themes.css` sincronizado; teste novo resolve a cascata de `data-theme` + `.dark` no mesmo elemento
