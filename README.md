# CAD — Collaborative Augmented Discovery

Plugin para Claude Code/Cowork que atua como **co-facilitador de descoberta
aumentada (CAD)**: escaneia exatamente as fontes que o consultor indica, extrai
fatos com **evidência rastreável**, detecta divergências, e depois **sintetiza**
esse conhecimento em artefatos fiéis a métodos específicos — começando por
**Lean Inception** (Paulo Caroli) e **DDD** (Eric Evans).

> Versão `0.1.0`. Especificação de referência (fonte da verdade):
> [`docs/cad-plugin-spec-v13.md`](docs/cad-plugin-spec-v13.md).

## Conceito

O CAD separa **descoberta** de **método**:

- **Substrato neutro** (`docs/cad/`) — conhecimento descritivo, sem opinião
  metodológica: base de conhecimento, log de evidências, vocabulário, regras de
  negócio, capacidades e backlog.
- **Módulos de técnica** (`docs/lean-inception/`, `docs/ddd/`) — cada um lê
  apenas o substrato e escreve apenas a sua própria pasta, produzindo artefatos
  fiéis ao método de origem. **Nenhuma técnica contamina outra.**

Tudo se apoia em um princípio inegociável: **sem evidência, sem afirmação**.
Cada bloco factual carrega `[Fonte: EV-XXX]` ou `[⚠️ Pendente: BL-XXX]`.

## Comandos

| Comando | Função |
|---|---|
| `/cad:discovery [fontes]` | Registra as fontes, escaneia só elas e popula o substrato neutro. Abre backlog para o que não tem evidência. |
| `/cad:synthesize <técnica> [escopo]` | Roda um módulo de técnica (`lean-inception` \| `ddd`): lê o substrato e gera os artefatos da técnica. |
| `/cad:backlog [id...]` | Apresenta pendências em formulário, grava a resposta como evidência "Validação Humana" e atualiza os documentos afetados. |

## Pré-requisitos

- **Node.js 18+** na máquina do consultor (runtime dos hooks). O instalador
  nativo do Claude Code **não** instala Node — instale-o separadamente.
- Node 22+ apenas para desenvolver/empacotar o plugin.

## Desenvolvimento

```bash
npm install
npm run typecheck      # tsc --noEmit
npm run build          # esbuild: src/ -> build/*.cjs autossuficientes
npm run package        # gera build/cad-claude-plugin.plugin
```

O plugin **não tem servidor MCP** e **zero dependências de runtime**: lê o
repositório do cliente com as ferramentas nativas do Claude Code; o que se
compila são apenas os 3 hooks e os helpers determinísticos.

## Licença

MIT © Heitor Rapcinski
