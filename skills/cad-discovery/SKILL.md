---
name: cad-discovery
description: Orquestrador /cad:discovery — escaneia exatamente as fontes indicadas pelo consultor e estrutura o conhecimento como um Knowledge Vault Zettelkasten/Obsidian em docs/cad/ (notas com frontmatter, [[links]], evidências rastreáveis nas pastas 01–13). Execução adaptativa: 1 agente iterativo para escopo pequeno, ou map-reduce com subagentes para escopo grande. Abre notas em 11 Investigations para o que não tem evidência. Não gera nenhum artefato de técnica.
argument-hint: "[fontes...]  (ex.: credito/ normativo_credito_v3.pdf)"
---

# /cad:discovery — Descoberta como Knowledge Vault (substrato neutro)

## Objetivo

Escanear **somente** as fontes que o consultor passou e **percorrê-las por inteiro**,
estruturando o conhecimento extraído como um **Knowledge Vault** pronto para o Obsidian em
`docs/cad/`: notas atômicas em Markdown, com **frontmatter YAML**, `[[links internos]]`,
callouts e Mermaid, organizadas na taxonomia numerada `01…13`. Cada afirmação é rastreável
até uma **nota de evidência** (`09 Evidence`). Tudo que não tem evidência clara vira uma
nota em `11 Investigations`. **Este comando nunca gera artefato de técnica** (nada em
`docs/lean-inception/`, `docs/ddd/`, etc.).

As convenções de nota (frontmatter, componentes, taxonomia, filosofia Knowledge×Discovery)
são a **fonte única** da skill [`cad-doc-conventions`](../cad-doc-conventions/SKILL.md) —
carregue-a antes de escrever qualquer nota.

## Entradas

- **Argumento `[fontes]`** — lista explícita de caminhos (arquivos ou pastas) e/ou
  normativos a escanear nesta sessão. Se vazio, **pergunte** ao consultor quais fontes
  escanear; **nunca** escaneie por conta própria uma fonte **nova** de sessões anteriores:
  o escopo de scan é sempre humano. A única releitura automática permitida é a de **fontes
  já autorizadas**, e ocorre apenas no aprofundamento sob demanda disparado por
  `/cad:synthesize` (quando os módulos de técnica forem migrados ao vault).
- `.cad-plugin/state.json` e `.cad-plugin/sources.json` (se existirem) — sessão atual e
  histórico. Se não existirem, crie-os.

## Estratégia de execução (adaptativa)

A descoberta escolhe o modo pelo **tamanho do escopo autorizado do run** — não paralelize
por reflexo; subagentes só compensam quando o escopo não cabe confortavelmente num contexto.

- **Escopo pequeno → 1 agente, passes iterativos.** Um arquivo, uma pasta enxuta, um
  normativo. Você mesmo varre e escreve, área por área (o **vault em disco é a memória**
  entre passes — releia-o conforme precisar). Sem subagentes.
- **Escopo grande → map-reduce com subagentes.** Repositório inteiro, muitos diretórios,
  dump de esquema, base documental extensa. Reparta e paralelize (fases abaixo). Se o
  runtime não oferecer subagentes, **degrade graciosamente** para os passes iterativos.

> **Regra de ouro do paralelismo:** subagentes fazem o **map** (extrair e escrever notas da
> sua fatia); só o **orquestrador** faz o **reduce** (identidade global, MOCs, dedup e
> **conflito entre fontes**). Nenhum subagente vê a fatia do outro — logo, nenhum decide
> conflito cruzado nem escreve MOC.

## Procedimento

### 0. Orquestrador — preparação (sempre, antes de qualquer escrita de nota)

1. **Registrar fontes** (escritor único: você). Para cada fonte do argumento, faça
   **append** em `.cad-plugin/sources.json` uma entrada com `id` (`SRC-NNN`, sequencial),
   `caminho`, `tipo` (`Normativo` | `Corporativo` | `Código` | `Informal`), `sessao` e
   `data`. Incremente a sessão em `state.json`. Os `SRC` são atribuídos **aqui, de uma vez**
   — os subagentes recebem a lista pronta e **não** criam `SRC`.
2. **Decidir o modo** (pequeno vs grande) e, se grande, **particionar** o escopo em fatias
   coesas (por subárvore/subsistema de preferência; por camada `01…13` quando a fonte for
   monolítica mas multifacetada). Atribua a cada subagente um **id** curto (`a1`, `a2`…) —
   ele entra no id das evidências daquele subagente: `EV-<sessão>-<agente>-<seq>`. A
   `<sessão>` (do `state.json`) garante unicidade entre runs; o `<agente>` garante que dois
   subagentes nunca colidam, sem escritor central.

### Modo A · 1 agente iterativo (escopo pequeno)

Faça os passos 3–6 abaixo você mesmo, área por área.

### Modo B · map-reduce (escopo grande)

**Map (paralelo).** Para cada fatia, dispare um **subagente de propósito geral (com
permissão de escrita)** com este briefing:

- **Escopo:** exatamente os caminhos da fatia — **não** saia deles, **não** registre fontes
  novas.
- **Id do agente:** o tag dado no dispatch (ex.: `a2`) — use-o nos IDs de evidência:
  `EV-<sessão>-<agente>-<seq>` (ex.: `EV-5-a2-007`), com `<seq>` sequencial **por agente**,
  começando em 1. Isso garante IDs **sem colisão** entre subagentes e entre runs, sem
  escritor central. O código vira `alias`; o **título** da nota carrega o resumo legível.
- **Skills a seguir:** [`cad-doc-conventions`](../cad-doc-conventions/SKILL.md) (backbone) +
  as de camada conforme o conteúdo — `cad-doc-evidence` (09), `cad-doc-business` (01–02),
  `cad-doc-system` (03–04), `cad-doc-technical` (05–08), `cad-doc-decisions` (10),
  `cad-doc-views` (12).
- **O que produzir:** capture a evidência **primeiro** (nota em `09 Evidence` com
  `source: SRC-NNN + localização`), depois as notas de Knowledge ligadas a ela via `source:`,
  e abra `11 Investigations` (`tags: consumidor/cad`) para as lacunas **da sua fatia**.
- **O que NÃO fazer:** não escreva MOCs (13), não crie o Registro de Evidências, não
  resolva conflito entre fatias, não toque em `sources.json`/`state.json`. Links `[[...]]`
  para notas que outra fatia vai criar são aceitáveis (ficam pendentes — é Zettelkasten).

**Reduce (só o orquestrador).** Quando as fatias terminarem:

- **Consolidar navegação:** construa/atualize os **MOCs** (`13 MOCs`, via `cad-doc-mocs`) e
  o **Registro de Evidências** (via `cad-doc-evidence`), agrupando por `SRC` e domínio/escopo.
- **Dedup de conceito transversal:** o mesmo conceito (`Cliente`) pode ter surgido em duas
  fatias. Funda numa nota canônica (ou ligue as variantes) e conserte os `[[links]]`.
- **Conflito entre fontes (o passo que só o todo enxerga):** compare evidências/afirmações
  entre fatias. Onde divergirem, aplique a **hierarquia** (Normativo > Corporativo > Código
  > Informal), registre a versão priorizada (`status: conflicting`) e abra uma nota em
  `11 Investigations` ligando as evidências divergentes.

### Passos comuns (executados por você no Modo A, ou por cada subagente no Modo B)

3. **Capturar evidência primeiro.** Para cada afirmação que a fonte sustenta, crie/atualize
   a nota de evidência em `09 Evidence` (via [`cad-doc-evidence`](../cad-doc-evidence/SKILL.md)):
   o artefato real (trecho de código, SQL, log, config, paráfrase de normativo),
   `source: SRC-NNN + localização`, e a lista **Sustenta**.
4. **Materializar o conhecimento em notas**, cada uma ligada à sua evidência via `source:`,
   distribuídas pelas pastas conforme a natureza — delegando à skill de cada camada
   (Knowledge 01–08: `cad-doc-business`, `cad-doc-system`, `cad-doc-technical`; Discovery
   10/12: `cad-doc-decisions`, `cad-doc-views`). **Ligue liberalmente** (`[[...]]`).
5. **Aplicar a regra de evidência** (detalhe em `cad-doc-conventions`):
   - Sem evidência clara → **não afirme, não assuma** → abra nota em `11 Investigations`
     (via [`cad-doc-investigations`](../cad-doc-investigations/SKILL.md), `status: open`,
     `tags: consumidor/cad`).
   - Definições conflitantes **dentro da sua fatia** → hierarquia + `status: conflicting` +
     investigação. (Conflito **entre** fatias é resolvido no reduce.)
   - Nota já validada por humano → **nunca sobrescreva**; conflito novo abre investigação
     `conflito_pós_validação`.
6. **Não tocar em nenhuma pasta de técnica.** Discovery escreve só em `docs/cad/`.

## Saída ao final

Atualize `state.json` (append no `historico`; registre o modo usado e, no Modo B, o nº de
fatias/subagentes) e **exiba um resumo de cobertura**: fontes escaneadas, notas de evidência
criadas, notas por pasta (01–13) e a **lista de investigações abertas** (`11 Investigations`)
— que apoia a decisão do consultor sobre quando o vault está "rico o bastante" para
sintetizar uma técnica (critério de parada).

## Regras inegociáveis

- Sem evidência, sem afirmação (a fonte vive numa nota de `09 Evidence`; o Knowledge liga a
  ela via `source:`).
- Escopo humano: só as fontes passadas; releitura automática **só** de fontes já autorizadas
  e apenas no aprofundamento de `/cad:synthesize` — fonte nova sempre volta ao humano.
- **Identidade sem colisão:** `SRC` é atribuído uma vez pelo orquestrador; `EV` é
  `EV-<sessão>-<agente>-<seq>` por subagente no Modo B (ou `EV-<sessão>-<seq>` no Modo A).
  Só o orquestrador faz o reduce (MOCs, dedup, conflito cruzado).
- Apêndice, nunca sobrescrita em `sources.json`/`state.json`; evidências são imutáveis.
- Proteção de notas validadas por humano.
- Substrato é **neutro**: nenhuma opinião de método aqui (bounded context, MVP, agregado…).
