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
- Releituras de aprofundamento disparadas por `/cad:synthesize` (quando os módulos de
  técnica forem migrados; releem um trecho de fonte **já autorizada** apontado por um `EV`).

## Template de nota de evidência (`09 Evidence/EV-XXX ....md`)

```markdown
---
title: EV-014 Aprovação exige duas alçadas
aliases: [EV-014]
tags: [evidencia, normativo]
type: evidence
status: confirmed
source: "SRC-002 · normativo_credito_v3.pdf · Seção 4.2"
author: CAD Discovery
created: 2026-07-10
---

# EV-014 · Aprovação exige duas alçadas

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
- [[EV-014]] — Aprovação exige duas alçadas
- ⚠️ conflita com [[EV-015]] → ver [[Investigação - Alçadas de Aprovação]]

## SRC-001 · credito/ (Código)
- [[EV-015]] — Código implementa uma alçada
```

## Como preencher

- **Uma nota por evidência**, id `EV-NNN` sequencial. O corpo guarda o artefato real
  (paráfrase de normativos/documentos protegidos; trecho literal curto só de código/SQL).
- **`source:` liga à fonte autorizada** via `SRC-XXX` + localização. É o elo que torna a
  fonte resolvível por máquina: o caminho real é `sources.json[SRC].caminho` + a
  localização desta nota. Evidência de **validação humana** usa
  `source: "validação humana (consultor) — <data>"` e não tem `SRC`.
- **Sustenta:** liste, via `[[...]]`, as notas de Knowledge que esta evidência apoia
  (relação inversa do `source:` delas). Mantém o grafo do Obsidian navegável nos dois sentidos.
- **Append, nunca sobrescrita:** evidências são **imutáveis**. Uma releitura de
  aprofundamento cria uma **nota nova** (marque `#aprofundamento` nas tags), nunca edita
  uma existente.
- **Conflitos:** quando duas evidências divergem, **não esconda** — registre ambas, marque
  a divergência no MOC e abra `11 Investigations` (via `cad-doc-investigations`). A
  hierarquia de fontes (Normativo > Corporativo > Código > Informal) define a versão
  priorizada; a **validação humana** supera todas.
- Mantenha o **MOC Registro de Evidências** atualizado a cada nova `EV`.
