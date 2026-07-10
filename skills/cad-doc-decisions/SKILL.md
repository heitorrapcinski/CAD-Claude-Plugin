---
name: cad-doc-decisions
description: Gerencia a pasta 10 Decisions do vault docs/cad/ — conclusões da engenharia reversa: ADRs (decisões arquiteturais identificadas), premissas assumidas e hipóteses confirmadas. Notas Zettelkasten rastreadas por evidência. Invocado por /cad:discovery e /cad:backlog.
---

# cad-doc-decisions — Decisions (10) (substrato neutro)

## Objetivo

Registrar as **conclusões da análise** (`10 Decisions`): responde *"quais conclusões foram
tiradas durante a engenharia reversa?"*. Inclui:

- **ADRs** — decisões arquiteturais identificadas no sistema (mesmo em legado, decisões
  podem ser **descobertas** e documentadas retroativamente).
- **Premissas** assumidas durante a análise (marcadas como tal).
- **Hipóteses confirmadas** — o que era dúvida em `11 Investigations` e virou conclusão
  sustentada por evidência.

Segue as [convenções do vault](../cad-doc-conventions/SKILL.md). É substrato **neutro** —
decisões descritas como observadas, sem opinião de método.

## Entradas

- Fontes escaneadas por `/cad:discovery` e as notas de `09 Evidence`.
- Notas de `11 Investigations` que se resolvem (hipótese confirmada vira decisão/conclusão).
- Respostas de `/cad:backlog` (validação humana).

## Template de nota (ADR / conclusão)

```markdown
---
title: ADR-003 Persistência em banco relacional único
aliases: [ADR-003]
tags: [adr, arquitetura]
type: adr
status: confirmed
source: "[[EV-041]]"
author: CAD Discovery
created: 2026-07-10
---

# ADR-003 · Persistência em banco relacional único

> [!note] Natureza
> Decisão **identificada** (engenharia reversa), não uma decisão nova do consultor.

## Contexto
O sistema concentra toda a persistência em [[TB_CLIENTE]], [[TB_DOCUMENTO]]… num único
esquema relacional.

## Decisão (observada)
Uso de banco relacional único, sem particionamento por domínio.

## Consequências
- Acoplamento de dados entre [[Módulo Financeiro]] e cadastro.

## Evidência
- [[EV-041]], [[EV-050]]
```

Para **premissa** use `type: decision`, `status: inferred` e deixe claro no corpo que é uma
suposição a validar. Para **hipótese confirmada**, referencie a investigação de origem:
`> Confirma [[Investigação - Alçadas de Aprovação]]`.

## Como preencher

- **ADR identificado ≠ ADR novo.** Deixe explícito no corpo se a decisão foi *observada no
  sistema* (engenharia reversa) ou *assumida na análise* (premissa). Não invente decisões.
- Toda conclusão traz `source:` → `09 Evidence`. Premissa sem evidência é `status: inferred`
  e deveria ter uma investigação associada em `11 Investigations`.
- Ao **confirmar uma hipótese**, atualize a nota de `11 Investigations` de origem (status →
  `confirmed`/`validated`) e ligue as duas notas.
- **Vocabulário proibido:** descreva a arquitetura como ela é; sem termos de técnica.
