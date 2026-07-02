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
Cada bloco factual carrega `[Fonte: EV-XXX]` ou `[⚠️ Pendente: BL-XXX]`, e a
**validação humana** (resposta do consultor via `/cad:backlog`) é a evidência
mais forte de todas.

## Comandos

| Comando | Função |
|---|---|
| `/cad:discovery [fontes]` | Registra as fontes em `.cad-plugin/sources.json`, escaneia só elas e popula o substrato neutro. Abre backlog para o que não tem evidência e exibe os IDs ao final. |
| `/cad:synthesize <técnica> [escopo]` | Roda um módulo de técnica (`lean-inception` \| `ddd`): lê o substrato e gera os artefatos da técnica em `docs/<técnica>/`. |
| `/cad:backlog [id...]` | Apresenta pendências em formulário, grava a resposta como evidência "Validação Humana" e atualiza os documentos afetados. |

## Skills (20)

- **3 orquestradores:** `cad-discovery`, `cad-synthesize`, `cad-backlog`.
- **6 do substrato neutro:** `cad-doc-knowledge-base`, `cad-doc-evidence-log`,
  `cad-doc-vocabulary`, `cad-doc-business-rules`, `cad-doc-capabilities`,
  `cad-doc-backlog`.
- **Módulo Lean Inception (7):** `lean-inception-module` (+ `module.json`) e
  `lean-inception-doc-product-framing` / `-personas` / `-features` / `-journeys` /
  `-sequencer` / `-mvp-canvas`.
- **Módulo DDD (4):** `ddd-module` (+ `module.json`) e `ddd-doc-strategic` /
  `ddd-doc-ubiquitous-language` / `ddd-doc-tactical`.

Cada `*-module/` traz um `module.json` (contrato enforceável: `pasta_saida`,
`entradas_substrato`, `artefatos`, `vocabulario_proibido`) lido pelos hooks e
pelo `cad-synthesize`.

## Hooks de enforcement (3)

Compilados para `build/hooks/*.cjs` e referenciados em
[`hooks/hooks.json`](hooks/hooks.json):

| Hook | Evento | Função |
|---|---|---|
| `validate-evidence` | `PostToolUse` `Write\|Edit` | Bloqueia bloco factual sem `[Fonte: EV-XXX]`/`[⚠️ Pendente: BL-XXX]` em `docs/<dir>/*.md` (princípio 1). |
| `protect-human-validation` | `PreToolUse` `Write\|Edit` | Impede remover/sobrescrever bloco de origem "validação humana" fora de `/cad:backlog` (princípio 7). Exceção sinalizada por `CAD_BACKLOG_FLOW=1`. |
| `technique-isolation` | `PreToolUse` `Write\|Edit` | Bloqueia escrita fora da `pasta_saida` ou com termo do `vocabulario_proibido` (princípio 3). Técnica ativa opcional via `CAD_ACTIVE_TECHNIQUE`. |

## Entregáveis gerados no repositório do cliente

```
docs/
  cad/            # substrato neutro: knowledge-base, evidence-log, vocabulary,
                  # business-rules, capabilities, backlog
  lean-inception/ # vision, product-enfn, objectives, personas, features,
                  # journeys, sequencer, mvp-canvas
  ddd/            # subdomains, bounded-contexts, ubiquitous-language,
                  # context-map, aggregates
.cad-plugin/      # controle em JSON (oculto): state.json, sources.json
```

> Esses arquivos são **saída de runtime** — não fazem parte do pacote do plugin.
> Os templates vivem dentro dos `SKILL.md`.

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
npm run dev:hook src/hooks/<hook>.ts   # roda um hook localmente (tsx)
```

O plugin **não tem servidor MCP** e tem **zero dependências de runtime**: lê o
repositório do cliente com as ferramentas nativas do Claude Code; o que se
compila são apenas os 3 hooks e os helpers determinísticos
(`src/lib/state.ts`, `src/lib/manifest.ts`). A versão é fonte única no
`package.json`, injetada em build via `__PKG_VERSION__` e espelhada em
`.claude-plugin/plugin.json`.

## Licença

MIT © Heitor Rapcinski
