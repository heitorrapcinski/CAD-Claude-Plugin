---
name: cad-doc-investigations
description: Gerencia a pasta 11 Investigations do vault docs/cad/ — o backlog da engenharia reversa em forma de notas: perguntas abertas, hipóteses, dúvidas, lacunas de documentação, conflitos entre fontes e pendências. Substitui o antigo backlog.md. Cada nota tem status (open|conflicting|confirmed|validated). Invocado por /cad:discovery, /cad:synthesize e /cad:backlog.
---

# cad-doc-investigations — Investigations (11) (substrato neutro)

## Objetivo

Manter o **backlog da engenharia reversa** como notas Zettelkasten: responde *"o que ainda
precisa ser investigado?"*. Evita que conhecimento **incompleto** ou **em dúvida** se perca.
É a pasta que **substitui o antigo `backlog.md`** — em vez de linhas numa tabela `BL-XXX`,
uma **nota por pendência**, ligada por `[[...]]` às notas que a originaram.

Segue as [convenções do vault](../cad-doc-conventions/SKILL.md).

## Entradas

- `/cad:discovery` — abre investigações para lacunas (sem evidência clara) e conflitos
  entre fontes detectados durante a varredura.
- `/cad:synthesize` — abre investigações quando um módulo de técnica precisa de um fato que
  não está no substrato (marque a técnica consumidora nas `tags`).
- `/cad:backlog` — lê as investigações abertas para apresentar ao consultor; ao receber
  resposta, **resolve** a nota (status → `validated`) e cria a evidência de validação humana.

## Template de nota de investigação

```markdown
---
title: Investigação - Alçadas de Aprovação
tags: [investigation, conflito, consumidor/cad]
type: investigation
status: conflicting   # open | conflicting | confirmed | validated
source:
author: CAD Discovery
created: 2026-07-10
---

# Investigação · Alçadas de Aprovação

> [!question] Pergunta
> A aprovação exige uma ou duas alçadas?

## Contexto / conflito
- [[EV-014]] (normativo) diz **duas** alçadas.
- [[EV-015]] (código) implementa **uma**.
- Versão priorizada pela hierarquia (Normativo > Código): **duas** — mas há divergência real.

## Afeta
- [[Regra - Limite de Crédito]], [[Fluxo - Aprovação]]

## Resolução
_(preenchido por /cad:backlog quando o consultor responder)_
```

Tipos de pendência (no corpo ou em `tags`): `lacuna`, `conflito_definição`,
`conflito_pós_validação`, `hipótese`, `experimento`.
Consumidor (em `tags`): `consumidor/cad` (descoberta) ou `consumidor/<técnica>`
(`consumidor/ddd`, `consumidor/lean-inception`…) — separa pendência de descoberta de
pendência de síntese.

## Como preencher

- **Uma nota por pendência.** `status: open` para pergunta/lacuna ainda sem resposta;
  `conflicting` quando há divergência entre fontes (registre ambas as evidências);
  `confirmed` quando vira conclusão (mova/ligue a `10 Decisions`); `validated` quando o
  consultor responde via `/cad:backlog`.
- **Sempre ligue** (`[[...]]`) às evidências e às notas de Knowledge afetadas — o grafo do
  Obsidian mostra o que está pendente e por quê.
- **Conflito pós-validação:** uma fonte nova conflita com um bloco **já validado por
  humano** — **nunca sobrescreva** o bloco validado; abra investigação
  `conflito_pós_validação` e trate via `/cad:backlog`.
- Investigação **não é afirmação**: uma nota `open` pode existir sem `source:` confirmado
  (o corpo registra o que disparou a dúvida).
- Ao resolver, deixe o rastro: preencha **Resolução**, atualize `status` e ligue à evidência
  de validação humana criada em `09 Evidence`.
