---
name: cad-doc-mocs
description: Gerencia a pasta 13 MOCs do vault docs/cad/ — Maps of Content que funcionam como índices navegáveis do vault (MOC - Arquitetura, - Código, - Dados, - Integrações, - Processos, - Operação, - Evidências). Conectam notas relacionadas e facilitam a navegação. Invocado por /cad:discovery e /cad:backlog.
---

# cad-doc-mocs — MOCs (13) (substrato neutro)

## Objetivo

Manter os **Maps of Content** (`13 MOCs`): responde *"como navegar pelo conhecimento?"*. Um
MOC é uma nota-índice que **conecta notas relacionadas** de uma área, dando ao vault pontos
de entrada navegáveis. MOCs **não contêm fatos próprios** — apenas organizam e ligam notas
que já existem em outras pastas.

Segue as [convenções do vault](../cad-doc-conventions/SKILL.md).

## Entradas

- Todas as notas de Knowledge (01–08) e de Discovery (09–12) já criadas.
- O MOC **Registro de Evidências** é mantido em conjunto com a skill `cad-doc-evidence`.

## MOCs típicos

`MOC - Arquitetura`, `MOC - Código`, `MOC - Banco de Dados`, `MOC - Integrações`,
`MOC - Processos`, `MOC - Operação`, `MOC - Fluxo de Negócio`, `Registro de Evidências`.
A lista é **aberta** — crie um MOC por área que ganhe massa crítica de notas.

## Template de nota MOC

```markdown
---
title: MOC - Banco de Dados
aliases: [MOC Dados]
tags: [moc, dados]
type: moc
status: confirmed
author: CAD Discovery
created: 2026-07-10
---

# MOC · Banco de Dados

Índice das notas de dados do sistema. Ver também [[MOC - Arquitetura]].

## Tabelas
- [[TB_CLIENTE]] — dados de [[Cliente]]
- [[TB_DOCUMENTO]] — dados de [[Documento]]

## Views e procedures
- [[VW_SALDO]]

## Modelos e relações
- [[Modelo de Dados - Crédito]]
```

## Como preencher

- **Só links e organização.** Um MOC agrupa `[[wikilinks]]` sob seções temáticas; não
  duplica o conteúdo das notas nem introduz afirmações novas — por isso **dispensa
  `source:`** (deriva de notas já evidenciadas).
- **Mantenha atualizado** conforme novas notas surgem na descoberta: cada nota relevante
  deveria estar alcançável a partir de ao menos um MOC.
- **Ligue MOCs entre si** (`[[MOC - Arquitetura]]`) para formar o mapa de nível superior do
  vault.
- **Vocabulário proibido:** índices neutros; nada de recortes de método (bounded context,
  ondas, personas…).
