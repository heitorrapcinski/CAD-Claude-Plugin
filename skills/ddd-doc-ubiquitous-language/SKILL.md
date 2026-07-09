---
name: ddd-doc-ubiquitous-language
description: Gera docs/ddd/ubiquitous-language.md — a linguagem ubíqua POR bounded context, consumindo o vocabulary.md neutro. É aqui que o mesmo termo ganha significados distintos por contexto (sinal de fronteira). Lê só o substrato CAD. Fiel a Eric Evans.
---

# ddd-doc-ubiquitous-language — Linguagem Ubíqua por Bounded Context

## Objetivo

Explicitar a **linguagem ubíqua por bounded context**, consumindo o
`vocabulary.md` neutro do substrato. É aqui que **o mesmo termo ganha significados
diferentes** em contextos diferentes — o sinal clássico de fronteira de contexto.

## Entradas

Lê **apenas** o substrato CAD: `vocabulary.md` (fonte primária), `evidence-log.md`
e `knowledge-base.md`. Usa os contextos definidos em `bounded-contexts.md` (deste
mesmo módulo). Escreve apenas em `docs/ddd/`.

## Template (copiar fielmente)

```markdown
# Linguagem Ubíqua — por Bounded Context

## Contexto: [Nome]
| Termo | Significado NESTE contexto | Termo no substrato | Evidência |
|---|---|---|---|
| Aprovação | etapa única de liberação automática | vocabulary.md#Aprovação | → EV-015 |
| Conta | carteira de crédito do cliente | vocabulary.md#Conta | → EV-061 |

## Contexto: [Outro Nome]
| Termo | Significado NESTE contexto | Termo no substrato | Evidência |
|---|---|---|---|
| Aprovação | fluxo de 2 alçadas (gerência + risco) | vocabulary.md#Aprovação | → EV-014 |

> O mesmo termo "Aprovação" significa coisas distintas em contextos distintos — esse
> é o sinal clássico de fronteira de contexto. Conflitos no `vocabulary.md` neutro
> frequentemente viram **dois significados legítimos** aqui, um por contexto.
```

## Como preencher

- Uma seção `## Contexto:` por bounded context (consistente com
  `bounded-contexts.md`).
- Cada termo aponta para o termo neutro de origem (`vocabulary.md#Termo`) e cita
  `EV-XXX`.
- **Conflito do `vocabulary.md` → dois significados legítimos:** quando um conflito
  do vocabulário neutro corresponde a contextos distintos, registre-o como **dois
  significados por contexto** (resolve a fronteira). Quando for genuína divergência
  a resolver, **não** invente o desempate — abra `[⚠️ Pendente: BL-XXX]`
  (consumidor: `ddd`) e leve a `/cad:backlog`.
- **Lacuna de detalhe fino → aprofundamento.** Se falta o significado
  concreto de um termo num contexto e um `EV` já aponta ao código/doc, **não infira
  em silêncio nem leia a fonte**: sinalize a lacuna com o **ponteiro de `EV`** para o
  orquestrador aprofundar (só fonte já autorizada). Fonte nova → `[⚠️ Pendente:
  BL-XXX]` (consumidor: `ddd`).
- **Vocabulário proibido:** nada de termos exclusivos da Lean (`MVP`, `persona`,
  `jornada` sentido Lean, `onda`/`sequenciador`, `é-não é-faz-não faz`) nem do Event
  Storming (`hotspot`, `evento-pivô`). O compartilhado com o ES é permitido.
