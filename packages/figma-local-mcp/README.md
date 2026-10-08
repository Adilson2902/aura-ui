# @adilsonmatos/figma-local-mcp

Servidor MCP Local de alta performance para integração direta com a API do Figma, utilizando Personal Access Token (PAT).

## 🚀 Ferramentas Disponíveis

| Ferramenta | Descrição |
| --- | --- |
| `get_design_context` | Extrai a estrutura limpa e simplificada (layout flexbox/auto-layout, dimensões, cores hex/rgba, tipografia, bordas) de um frame ou nó do Figma. Ideal para gerar componentes React e Tailwind. |
| `get_file` | Retorna o documento completo e páginas do arquivo Figma. |
| `get_node` | Retorna os nós brutos específicos pelo Node ID. |
| `export_image` | Renderiza e exporta qualquer nó/frame em PNG, SVG, JPG ou PDF, com opção de salvar diretamente no projeto (`savePath`). |
| `get_variables` | Obtém todas as coleções de variáveis e design tokens locais (cores, espaçamentos, números). |
| `get_styles` | Obtém todos os estilos de texto, cores e efeitos do arquivo. |
| `get_comments` | Lista comentários e threads de discussão do arquivo. |
| `post_comment` | Publica um comentário no arquivo ou nó específico do Figma. |

## 🔑 Autenticação

A chave de acesso é lida com a seguinte prioridade:
1. Argumento CLI `--figma-api-key <token>` ou `--token <token>`
2. Variáveis de ambiente `FIGMA_API_KEY`, `FIGMA_ACCESS_TOKEN`, `FIGMA_TOKEN`
3. Token via FIGMA_API_KEY (nunca commite tokens): `figd_SUA_CHAVE_AQUI`

## 📦 Uso no OpenCode, Cursor, Antigravity e Claude

### OpenCode (`~/.config/opencode/opencode.json`)
```json
{
  "mcp": {
    "figma-local": {
      "type": "local",
      "command": ["node", "C:/Users/Adilson Adriano/Documents/aura-ui/packages/figma-local-mcp/dist/index.js"],
      "environment": {
        "FIGMA_API_KEY": "figd_SUA_CHAVE_AQUI"
      },
      "enabled": true
    }
  }
}
```

### Cursor (`~/.cursor/mcp.json`) / Antigravity (`~/.gemini/config/mcp_config.json`)
```json
{
  "mcpServers": {
    "figma-local": {
      "command": "node",
      "args": ["C:/Users/Adilson Adriano/Documents/aura-ui/packages/figma-local-mcp/dist/index.js"],
      "env": {
        "FIGMA_API_KEY": "figd_SUA_CHAVE_AQUI"
      }
    }
  }
}
```
