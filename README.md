# CAD — Collaborative Augmented Discovery

Plugin para Claude Code/Cowork que atua como **co-facilitador de descoberta
aumentada (CAD)**: escaneia exatamente as fontes que o consultor indica, extrai
fatos com **evidência rastreável**, detecta divergências, e depois **sintetiza**
esse conhecimento em artefatos fiéis a métodos específicos — **Lean Inception**
(Paulo Caroli), **DDD** (Eric Evans) e **Event Storming** (Alberto Brandolini).

> Versão `0.4.0`. Racional de design (princípios, arquitetura, contrato de módulo):
> [`DESIGN.md`](DESIGN.md). Histórico de mudanças: [`CHANGELOG.md`](CHANGELOG.md).

## Conceito

O CAD separa **descoberta** de **método**:

- **Substrato neutro = Knowledge Vault** (`docs/cad/`) — conhecimento descritivo,
  independente de metodologia, estruturado como **notas Zettelkasten prontas para o
  Obsidian** numa taxonomia numerada `01…13`, dividida em **Knowledge (01–08)** — o que é /
  por que existe / do que é composto / como funciona / como foi implementado / como opera —
  e **Discovery (09–13)** — evidências, decisões, investigações, visões e mapas de
  navegação. Cada nota tem frontmatter YAML, `[[links]]`, callouts e Mermaid.
- **Módulos de técnica** (`docs/lean-inception/`, `docs/ddd/`,
  `docs/event-storming/`) — cada um lê apenas o substrato e escreve apenas a sua
  própria pasta, produzindo artefatos fiéis ao método de origem. **Nenhuma técnica
  contamina outra.** Vocabulário legitimamente **compartilhado** entre técnicas
  complementares (ES e DDD: `aggregate`, `domain event`, `command`, `policy`,
  `read model`, `bounded context`) não é barrado; só as assinaturas **exclusivas**.

Tudo se apoia em um princípio inegociável: **sem evidência, sem afirmação**. No vault, a
rastreabilidade vive no **frontmatter `source:`** de cada nota, apontando para uma nota de
**`09 Evidence`** (que guarda o artefato real: trecho de código, SQL, log, config,
entrevista); um MOC **Registro de Evidências** (`13 MOCs`) indexa tudo. A **validação
humana** (resposta do consultor via `/cad:backlog` sobre uma nota de `11 Investigations`) é
a evidência mais forte de todas.

> ⚠️ **Migração em andamento (0.4.0 → 0.5.0).** Esta versão migrou **a descoberta e o
> substrato** para o Knowledge Vault. Os módulos de técnica (`lean-inception`, `ddd`,
> `event-storming`) ainda leem o substrato plano antigo (`knowledge-base.md`,
> `evidence-log.md`, `data-structures.md`, `backlog.md`…) e serão **migrados para ler o
> vault na 0.5.0**; até lá, `/cad:synthesize` avisa a pendência em vez de inventar conteúdo.
> A descrição de **aprofundamento sob demanda** abaixo refere-se ao modelo pré-migração.

**Aprofundamento sob demanda (módulos legados).** Quando falta detalhe **fino**, a síntese
relê **apenas fontes já autorizadas** (apontadas por um `EV` em `sources.json`), via os
skills de descoberta, grava o detalhe como **fato neutro novo** e o módulo então o cita — o
aprofundamento é a **rede**, não o caminho principal. O módulo **nunca** lê a fonte nem
escreve o substrato; **fonte nova sempre volta ao humano**. Configurável por módulo
(`pode_aprofundar`) e por run (`--sem-aprofundamento`).

## Comandos

| Comando | Função |
|---|---|
| `/cad:discovery [fontes]` | Registra as fontes em `.cad-plugin/sources.json`, escaneia só elas por inteiro e estrutura o conhecimento como um Knowledge Vault Zettelkasten em `docs/cad/` (notas `01…13` com frontmatter e `[[links]]`). Abre notas em `11 Investigations` para o que não tem evidência e exibe as investigações abertas ao final. |
| `/cad:synthesize <técnica> [escopo]` | Roda um módulo de técnica (`lean-inception` \| `ddd` \| `event-storming`, descoberto dinamicamente pelo `module.json`): lê o substrato e gera os artefatos da técnica em `docs/<técnica>/`. **Pendente de migração ao vault (0.5.0).** Faz **aprofundamento sob demanda** (relê fonte já autorizada para detalhe fino); `--sem-aprofundamento` força o modo conservador. |
| `/cad:backlog [nota...]` | Apresenta as investigações abertas (`11 Investigations`) em formulário, grava a resposta como evidência "Validação Humana" em `09 Evidence` e propaga a atualização às notas afetadas. |

## Skills (28)

- **3 orquestradores:** `cad-discovery`, `cad-synthesize`, `cad-backlog`.
- **9 do substrato neutro (Knowledge Vault):** `cad-doc-conventions` (backbone);
  Knowledge — `cad-doc-business` (01+02), `cad-doc-system` (03+04),
  `cad-doc-technical` (05+06+07+08); Discovery — `cad-doc-evidence` (09),
  `cad-doc-decisions` (10), `cad-doc-investigations` (11), `cad-doc-views` (12),
  `cad-doc-mocs` (13).
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
| `validate-evidence` | `PostToolUse` `Write\|Edit` | **Dois modos.** Em `docs/cad/**` (vault) exige frontmatter com `source:` não-vazio (isentas `11 Investigations`/`12 Views`/`13 MOCs`); em `docs/<técnica>/*.md` (legado) mantém o cheque inline `[Fonte: EV-XXX]`/`[⚠️ Pendente: BL-XXX]` (princípio 1). |
| `protect-human-validation` | `PreToolUse` `Write\|Edit` | Impede remover/sobrescrever nota/bloco de origem "validação humana" (frase ou `status: validated`) fora de `/cad:backlog` (princípio 7). Exceção sinalizada por `CAD_BACKLOG_FLOW=1`. |
| `technique-isolation` | `PreToolUse` `Write\|Edit` | Bloqueia escrita fora da `pasta_saida` ou com termo do `vocabulario_proibido` (princípio 3). Técnica ativa opcional via `CAD_ACTIVE_TECHNIQUE`. No **aprofundamento sob demanda**, `CAD_APROFUNDAMENTO=1` libera a escrita da **descoberta** no substrato; um skill de **módulo** que tente escrever `docs/cad/` é bloqueado. |

## Entregáveis gerados no repositório do cliente

```
docs/
  cad/            # Knowledge Vault (Zettelkasten/Obsidian) — notas com frontmatter
    01 Overview/               09 Evidence/
    02 Business Knowledge/     10 Decisions/
    03 Structural Knowledge/   11 Investigations/   (substitui o backlog)
    04 Behavioral Knowledge/   12 Views/
    05 Source Code/            13 MOCs/
    06 Data/
    07 Integrations/           # Knowledge = 01–08 · Discovery = 09–13
    08 Operational Architecture/
  lean-inception/ # vision, product-enfn, objectives, personas, features,
                  # journeys, sequencer, mvp-canvas   (pendente de migração ao vault)
  ddd/            # subdomains, bounded-contexts, ubiquitous-language,
                  # context-map, aggregates           (pendente de migração ao vault)
  event-storming/ # timeline, flows, hotspots, boundaries  (pendente de migração)
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
