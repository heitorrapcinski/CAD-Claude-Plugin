---
name: cad-discovery
description: Orquestrador /cad:discovery — escaneia exatamente as fontes indicadas pelo consultor e estrutura o conhecimento como um Knowledge Vault Zettelkasten/Obsidian em docs/cad/ (notas com frontmatter, [[links]], evidências rastreáveis nas pastas 01–13). Abre notas em 11 Investigations para o que não tem evidência. Não gera nenhum artefato de técnica.
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

## Procedimento

1. **Registrar fontes.** Para cada fonte do argumento, faça **append** em
   `.cad-plugin/sources.json` (nunca sobrescreva) uma entrada com `id` (`SRC-NNN`),
   `caminho`, `tipo` (`Normativo` | `Corporativo` | `Código` | `Informal`), `sessao` e
   `data`. Incremente a sessão em `state.json`.
2. **Percorrer toda a fonte** com as ferramentas nativas (Read/Grep/Glob). Não saia do
   escopo declarado, mas **cubra-o por inteiro** — o objetivo é um retrato completo do
   sistema, não uma amostra.
3. **Capturar evidência primeiro.** Para cada afirmação que a fonte sustenta, crie/atualize
   a nota de evidência em `09 Evidence` (via [`cad-doc-evidence`](../cad-doc-evidence/SKILL.md)):
   `EV-NNN` com o artefato real (trecho de código, SQL, log, config, paráfrase de normativo),
   `source: SRC-NNN + localização`, e a lista **Sustenta**.
4. **Materializar o conhecimento em notas**, cada uma ligada à sua evidência via `source:`,
   distribuídas pelas pastas conforme a natureza — delegando à skill de cada camada:
   - **Knowledge (01–08):**
     [`cad-doc-business`](../cad-doc-business/SKILL.md) (01 Overview, 02 Business),
     [`cad-doc-system`](../cad-doc-system/SKILL.md) (03 Structural, 04 Behavioral),
     [`cad-doc-technical`](../cad-doc-technical/SKILL.md) (05 Source Code, 06 Data,
     07 Integrations, 08 Operational Architecture).
   - **Discovery (09–13):** [`cad-doc-decisions`](../cad-doc-decisions/SKILL.md) (10),
     [`cad-doc-views`](../cad-doc-views/SKILL.md) (12) e
     [`cad-doc-mocs`](../cad-doc-mocs/SKILL.md) (13).
   - **Ligue liberalmente** (`[[...]]`) entre notas e mantenha os **MOCs** (13) como índices
     navegáveis — incluindo o **Registro de Evidências**.
5. **Aplicar a regra de evidência** (detalhe em `cad-doc-conventions`):
   - Sem evidência clara → **não afirme, não assuma** → abra nota em `11 Investigations`
     (via [`cad-doc-investigations`](../cad-doc-investigations/SKILL.md), `status: open`,
     `tags: consumidor/cad`).
   - Definições conflitantes entre fontes → aplique a **hierarquia** (Normativo >
     Corporativo > Código > Informal): registre a versão priorizada (`status: conflicting`)
     e abra investigação com o conflito, ligando as duas evidências.
   - Nota já validada por humano → **nunca sobrescreva**; conflito novo abre investigação
     `conflito_pós_validação`.
6. **Não tocar em nenhuma pasta de técnica.** Discovery escreve só em `docs/cad/`.

## Saída ao final

Atualize `state.json` (append no `historico`) e **exiba um resumo de cobertura**: fontes
escaneadas, notas de evidência criadas, notas por pasta (01–13) e a **lista de investigações
abertas** (`11 Investigations`) — que apoia a decisão do consultor sobre quando o vault está
"rico o bastante" para sintetizar uma técnica (critério de parada).

## Regras inegociáveis

- Sem evidência, sem afirmação (a fonte vive numa nota de `09 Evidence`; o Knowledge liga a
  ela via `source:`).
- Escopo humano: só as fontes passadas; releitura automática **só** de fontes já autorizadas
  e apenas no aprofundamento de `/cad:synthesize` — fonte nova sempre volta ao humano.
- Apêndice, nunca sobrescrita em `sources.json`/`state.json`; evidências são imutáveis.
- Proteção de notas validadas por humano.
- Substrato é **neutro**: nenhuma opinião de método aqui (bounded context, MVP, agregado…).
