# CAD — Collaborative Augmented Discovery

Plugin para Claude Code/Cowork que atua como **co-facilitador de descoberta
aumentada (CAD)**: escaneia exatamente as fontes que o consultor indica, extrai
fatos com **evidência rastreável**, detecta divergências, e depois **sintetiza**
esse conhecimento em artefatos fiéis a métodos específicos — **Lean Inception**
(Paulo Caroli), **DDD** (Eric Evans) e **Event Storming** (Alberto Brandolini).

> Versão `0.2.0`. Racional de design (princípios, arquitetura, contrato de módulo):
> [`DESIGN.md`](DESIGN.md). Histórico de mudanças: [`CHANGELOG.md`](CHANGELOG.md).

## Conceito

O CAD separa **descoberta** de **método**:

- **Substrato neutro** (`docs/cad/`) — conhecimento descritivo, sem opinião
  metodológica: base de conhecimento, log de evidências, vocabulário, regras de
  negócio, capacidades, **estruturas de dados** (campos, exemplos, formato, relações,
  em nível conceitual/lógico e sem tecnologia) e backlog.
- **Módulos de técnica** (`docs/lean-inception/`, `docs/ddd/`,
  `docs/event-storming/`) — cada um lê apenas o substrato e escreve apenas a sua
  própria pasta, produzindo artefatos fiéis ao método de origem. **Nenhuma técnica
  contamina outra.** Vocabulário legitimamente **compartilhado** entre técnicas
  complementares (ES e DDD: `aggregate`, `domain event`, `command`, `policy`,
  `read model`, `bounded context`) não é barrado; só as assinaturas **exclusivas**.

Tudo se apoia em um princípio inegociável: **sem evidência, sem afirmação**.
Cada bloco factual carrega `[Fonte: EV-XXX]` ou `[⚠️ Pendente: BL-XXX]`, e a
**validação humana** (resposta do consultor via `/cad:backlog`) é a evidência
mais forte de todas.

**Estruturas de dados e aprofundamento sob demanda.** A descoberta front-carrega as
estruturas de dados em `data-structures.md` (campos, exemplos, formato, relações), que
o DDD tático consome como **fonte primária** de atributos. Quando ainda falta detalhe
**fino**, a síntese relê **apenas fontes já autorizadas** (apontadas por um `EV` em
`sources.json`, resolvendo o caminho pela coluna `SRC` do `evidence-log`), via os
skills de descoberta, grava o detalhe como **fato neutro novo** e o módulo então o
cita — o aprofundamento é a **rede**, não o caminho principal. O módulo **nunca** lê a
fonte nem escreve o substrato; **fonte nova sempre volta ao humano** (backlog).
Configurável por módulo (`pode_aprofundar`) e por run (`--sem-aprofundamento`).

## Comandos

| Comando | Função |
|---|---|
| `/cad:discovery [fontes]` | Registra as fontes em `.cad-plugin/sources.json`, escaneia só elas e popula o substrato neutro. Abre backlog para o que não tem evidência e exibe os IDs ao final. |
| `/cad:synthesize <técnica> [escopo]` | Roda um módulo de técnica (`lean-inception` \| `ddd` \| `event-storming`, descoberto dinamicamente pelo `module.json`): lê o substrato e gera os artefatos da técnica em `docs/<técnica>/`. Faz **aprofundamento sob demanda** (relê fonte já autorizada para detalhe fino); `--sem-aprofundamento` força o modo conservador. |
| `/cad:backlog [id...]` | Apresenta pendências em formulário, grava a resposta como evidência "Validação Humana" e atualiza os documentos afetados. |

## Skills (26)

- **3 orquestradores:** `cad-discovery`, `cad-synthesize`, `cad-backlog`.
- **7 do substrato neutro:** `cad-doc-knowledge-base`, `cad-doc-evidence-log`,
  `cad-doc-vocabulary`, `cad-doc-business-rules`, `cad-doc-capabilities`,
  `cad-doc-data-structures`, `cad-doc-backlog`.
- **Módulo Lean Inception (7):** `lean-inception-module` (+ `module.json`) e
  `lean-inception-doc-product-framing` / `-personas` / `-features` / `-journeys` /
  `-sequencer` / `-mvp-canvas`.
- **Módulo DDD (4):** `ddd-module` (+ `module.json`) e `ddd-doc-strategic` /
  `ddd-doc-ubiquitous-language` / `ddd-doc-tactical`.
- **Módulo Event Storming (5):** `event-storming-module` (+ `module.json`) e
  `event-storming-doc-timeline` / `-flows` / `-hotspots` / `-boundaries`.

Cada `*-module/` traz um `module.json` (contrato enforceável: `pode_aprofundar`,
`pasta_saida`, `entradas_substrato`, `artefatos`, `vocabulario_proibido`) lido
pelos hooks e pelo `cad-synthesize`. As técnicas são **descobertas dinamicamente**
pelo glob de `skills/*-module/module.json` — um módulo novo passa a valer só por
existir seu `module.json`, sem tocar no núcleo.

## Hooks de enforcement (3)

Compilados para `build/hooks/*.cjs` e referenciados em
[`hooks/hooks.json`](hooks/hooks.json):

| Hook | Evento | Função |
|---|---|---|
| `validate-evidence` | `PostToolUse` `Write\|Edit` | Bloqueia bloco factual sem `[Fonte: EV-XXX]`/`[⚠️ Pendente: BL-XXX]` em `docs/<dir>/*.md` (princípio 1). |
| `protect-human-validation` | `PreToolUse` `Write\|Edit` | Impede remover/sobrescrever bloco de origem "validação humana" fora de `/cad:backlog` (princípio 7). Exceção sinalizada por `CAD_BACKLOG_FLOW=1`. |
| `technique-isolation` | `PreToolUse` `Write\|Edit` | Bloqueia escrita fora da `pasta_saida` ou com termo do `vocabulario_proibido` (princípio 3). Técnica ativa opcional via `CAD_ACTIVE_TECHNIQUE`. No **aprofundamento sob demanda**, `CAD_APROFUNDAMENTO=1` libera a escrita da **descoberta** no substrato; um skill de **módulo** que tente escrever `docs/cad/` é bloqueado. |

## Entregáveis gerados no repositório do cliente

```
docs/
  cad/            # substrato neutro: knowledge-base, evidence-log, vocabulary,
                  # business-rules, capabilities, data-structures, backlog
  lean-inception/ # vision, product-enfn, objectives, personas, features,
                  # journeys, sequencer, mvp-canvas
  ddd/            # subdomains, bounded-contexts, ubiquitous-language,
                  # context-map, aggregates
  event-storming/ # timeline, flows, hotspots, boundaries
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
