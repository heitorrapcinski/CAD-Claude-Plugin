---
name: cad-doc-evidence
description: Gerencia a pasta 09 Evidence do vault docs/cad/ — notas de evidência (EV-XXX) que guardam o artefato real (trecho de código, SQL, log, print, entrevista, config) que sustenta cada afirmação, mais o MOC "Registro de Evidências" em 13 MOCs. É a âncora de rastreabilidade: toda nota de Knowledge aponta para cá via source:. Invocado por /cad:discovery, /cad:synthesize e /cad:backlog.
---

# cad-doc-evidence — Evidence (09) + Registro de Evidências (substrato neutro)

## Objetivo

Manter a **camada de rastreabilidade** do vault: cada afirmação de Knowledge é sustentada
por uma **nota de evidência** em `09 Evidence`, identificada por `EV-XXX`, que guarda o
**artefato real** (o trecho de código, a query, o log, o print, a citação da entrevista, o
arquivo de config). É o análogo Zettelkasten do antigo `evidence-log.md`: em vez de uma
tabela monolítica, uma **nota por evidência** + um **MOC** que as indexa.

Segue as [convenções do vault](../cad-doc-conventions/SKILL.md).

## Entradas

- Fontes escaneadas por `/cad:discovery` (no escopo declarado; registradas em
  `.cad-plugin/sources.json` como `SRC-XXX`).
- Respostas do consultor em `/cad:backlog` (geram evidência de **validação humana**).

## Template de nota de evidência (`09 Evidence/EV-XXX ....md`)

```markdown
---
title: EV-5-a2-007 · Aprovação exige duas alçadas
aliases: [EV-5-a2-007]
tags: [evidencia, normativo, dominio/credito]
type: evidence
status: confirmed
source: "SRC-002 · normativo_credito_v3.pdf · Seção 4.2"
author: CAD Discovery
created: 2026-07-10
---

# EV-5-a2-007 · Aprovação exige duas alçadas

> [!quote] Trecho da fonte (paráfrase)
> A aprovação de crédito acima do limite requer duas alçadas distintas.

- **Fonte (SRC):** [[SRC-002]] — `normativo_credito_v3.pdf`
- **Localização:** Seção 4.2
- **Tipo de fonte:** Normativo

## Sustenta
- [[Regra - Limite de Crédito]]
- [[Fluxo - Aprovação]]
```

Tipos de fonte: `Normativo`, `Corporativo`, `Código`, `Informal`, `Validação Humana`.

## MOC "Registro de Evidências" (`13 MOCs/Registro de Evidências.md`)

Índice navegável de todas as evidências, agrupadas por `SRC`, com marcação de conflitos:

```markdown
---
title: Registro de Evidências
tags: [moc, evidencia]
type: moc
status: confirmed
author: CAD Discovery
created: 2026-07-10
---

# MOC · Registro de Evidências

## SRC-002 · normativo_credito_v3.pdf (Normativo)
- [[EV-5-a2-007 · Aprovação exige duas alçadas|EV-5-a2-007]] — Aprovação exige duas alçadas
- ⚠️ conflita com [[EV-5-a1-011 · Código implementa uma alçada|EV-5-a1-011]] → ver [[Investigação - Alçadas de Aprovação]]

## SRC-001 · credito/ (Código)
- [[EV-5-a1-011 · Código implementa uma alçada|EV-5-a1-011]] — Código implementa uma alçada
```

## Como preencher

- **Uma nota por evidência.** O id é **`EV-<sessão>-<agente>-<seq>`** (ver
  [convenções](../cad-doc-conventions/SKILL.md)): `<sessão>` do `state.json`, `<agente>` o id
  dado pelo orquestrador ao subagente (`a1`, `a2`…) e `<seq>` sequencial **por agente** — ex.:
  `EV-5-a2-007`. No modo de **1 agente** o `<agente>` é omitido: `EV-5-014`. O código vira
  `alias` e o **título** carrega o resumo legível. O corpo guarda o artefato real (paráfrase
  de normativos/documentos protegidos; trecho literal curto só de código/SQL).
- **`source:` liga à fonte autorizada** via `SRC-XXX` + localização. É o elo que torna a
  fonte resolvível por máquina: o caminho real é `sources.json[SRC].caminho` + a
  localização desta nota. Evidência de **validação humana** usa
  `source: "validação humana (consultor) — <data>"` e não tem `SRC`.
- **Sustenta:** liste, via `[[...]]`, as notas de Knowledge que esta evidência apoia
  (relação inversa do `source:` delas). Mantém o grafo do Obsidian navegável nos dois sentidos.
- **Como esta evidência é referenciada (evite órfãos):** as notas que citam esta evidência
  devem linká-la **pelo título completo** (o nome do arquivo), exibindo o código:
  `[[EV-5-a2-007 · Aprovação exige duas alçadas|EV-5-a2-007]]`. Um link pelo **código sozinho**
  (`[[EV-5-a2-007]]`) pode não resolver — mesmo com `aliases` — e vira nó órfão no grafo. Como
  a evidência é imutável, o título é estável e o link não quebra. **Quando uma nota cita mais
  de uma evidência no `source:`, use uma lista YAML** (um link por item) — vários `[[...]]`
  numa mesma string de frontmatter não resolvem.
- **Append, nunca sobrescrita:** evidências são **imutáveis**. Reescanear uma fonte numa
  sessão futura cria uma **nota nova**, nunca edita uma existente.
- **Conflitos:** quando duas evidências divergem, **não esconda** — registre ambas, marque
  a divergência no MOC e abra `11 Investigations` (via `cad-doc-investigations`). A
  hierarquia de fontes (Normativo > Corporativo > Código > Informal) define a versão
  priorizada; a **validação humana** supera todas.
- Mantenha o **MOC Registro de Evidências** atualizado a cada nova `EV`. **No modo
  map-reduce, o Registro é construído/consolidado só na fase de reduce, pelo orquestrador**
  (agrupando por `SRC` e domínio/escopo) — os subagentes criam notas de evidência na sua fatia,
  mas **não** escrevem o Registro nem resolvem conflito entre fatias.
