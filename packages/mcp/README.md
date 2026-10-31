# aura-ui-mcp

Servidor **MCP** do [Aura UI](https://github.com/Adilson2902/aura-ui): dá ao seu assistente de IA (Claude Code, Claude Desktop, Cursor, VS Code/Copilot…) o catálogo, a API real e o código-fonte dos 73 componentes e 23 efeitos, os 33 temas, os tokens e o passo a passo de instalação — para ele gerar UI com o design system sem inventar props.

Roda local (stdio), sem rede e sem chave de API: o catálogo vem embutido no pacote.

## Ferramentas

| Ferramenta          | O que faz                                                                                                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `list_components`   | Lista por categoria ou busca (`query: "select pesquisável"`, `"upload"`, `"modal confirmação"`)                                                                            |
| `get_component`     | Resumo, import (`aura-ui-components/<nome>`), comando do CLI, exports, tipos, dependências e código-fonte — com `include_dependencies` traz também o código do que ele usa |
| `get_setup`         | Instalação no modo pacote ou CLI, para Next.js, Vite ou outro (Tailwind v4, CSS global, ThemeProvider)                                                                     |
| `list_themes`       | Os 33 temas e como aplicar/trocar (data-theme, `.dark`, ThemeProvider, ThemeSwitcher)                                                                                      |
| `get_design_tokens` | Tokens `--aura-*` (claro/escuro), utilities do preset e classes do core                                                                                                    |

## Instalação

### Claude Code — plugin (MCP + skill com as regras do design system)

```text
/plugin marketplace add Adilson2902/aura-ui
/plugin install aura-ui@aura-ui
```

### Claude Code — só o MCP

```bash
claude mcp add aura-ui -- npx -y aura-ui-mcp@latest
```

### Claude Desktop / Cursor

`claude_desktop_config.json` ou `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "aura-ui": { "command": "npx", "args": ["-y", "aura-ui-mcp@latest"] }
  }
}
```

### VS Code (Copilot)

`.vscode/mcp.json`:

```json
{
  "servers": {
    "aura-ui": { "type": "stdio", "command": "npx", "args": ["-y", "aura-ui-mcp@latest"] }
  }
}
```

### Windows

Em clientes que não acham o `npx` no Windows, use `"command": "cmd"` e `"args": ["/c", "npx", "-y", "aura-ui-mcp@latest"]`.

## Exemplos de pedido

- "Monte uma landing page com Aura UI: hero aurora, recursos, preços e depoimentos."
- "Adicione um formulário de cadastro com validação usando os componentes Field do Aura UI."
- "Troque o tema para `ocean` e use a cor da marca #0EA5E9."

## Versão

A versão do `aura-ui-mcp` acompanha a dos pacotes `aura-ui-*` (o catálogo é gerado do mesmo código publicado).

**MIT**
