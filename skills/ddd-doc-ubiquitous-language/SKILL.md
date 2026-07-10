---
name: ddd-doc-ubiquitous-language
description: Gera docs/ddd/ubiquitous-language.md — a linguagem ubíqua POR bounded context, consumindo o glossário/conceitos neutros do vault. É aqui que o mesmo termo ganha significados distintos por contexto (sinal de fronteira). Lê só o substrato CAD. Fiel a Eric Evans.
---

# ddd-doc-ubiquitous-language — Linguagem Ubíqua por Bounded Context

## Objetivo

Explicitar a **linguagem ubíqua por bounded context**, consumindo o **glossário**
(`01 Overview/`) e os **conceitos** (`03 Structural Knowledge/`) neutros do vault. É
aqui que **o mesmo termo ganha significados diferentes** em contextos diferentes — o
sinal clássico de fronteira de contexto.

## Entradas

Lê **apenas** o substrato CAD (Knowledge Vault): o **glossário** (`01 Overview/`) e os
**conceitos** (`03 Structural Knowledge/`) como fonte primária, mais as notas de
**evidência** (`09 Evidence/`). Divergências de definição vêm de `11 Investigations/`
(conflitos). Usa os contextos definidos em `bounded-contexts.md` (deste mesmo módulo).
Escreve apenas em `docs/ddd/`.

## Template (copiar fielmente)

```markdown
# Linguagem Ubíqua — por Bounded Context

## Contexto: [Nome]
| Termo | Significado NESTE contexto | Nota do substrato | Evidência |
|---|---|---|---|
| Aprovação | etapa única de liberação automática | [[Aprovação]] | [[EV-5-a1-011 · Código implementa uma alçada|EV-5-a1-011]] |
| Conta | carteira de crédito do cliente | [[Conta]] | [[EV-5-a1-020 · Conta é carteira de crédito|EV-5-a1-020]] |

## Contexto: [Outro Nome]
| Termo | Significado NESTE contexto | Nota do substrato | Evidência |
|---|---|---|---|
| Aprovação | fluxo de 2 alçadas (gerência + risco) | [[Aprovação]] | [[EV-5-a2-007 · Aprovação exige duas alçadas|EV-5-a2-007]] |

> O mesmo termo "Aprovação" significa coisas distintas em contextos distintos — esse
> é o sinal clássico de fronteira de contexto. Conflitos de definição registrados em
> `11 Investigations` frequentemente viram **dois significados legítimos** aqui, um por
> contexto.
```

## Como preencher

- Uma seção `## Contexto:` por bounded context (consistente com
  `bounded-contexts.md`).
- Cada termo aponta para a **nota neutra de origem** por wikilink (`[[Aprovação]]` — o
  conceito/glossário do vault) e cita a evidência por `[[EV-… · resumo|EV-…]]`.
- **Conflito → dois significados legítimos:** quando uma investigação de conflito
  (`11 Investigations`, `status: conflicting`) corresponde a contextos distintos,
  registre-a como **dois significados por contexto** (resolve a fronteira). Quando for
  genuína divergência a resolver, **não** invente o desempate — marque
  `[⚠️ Pendente: [[Investigação - …]]]` (consumidor: `ddd`) e leve a `/cad:backlog`.
- **Faltou o significado concreto de um termo num contexto?** Se não está no vault, **não
  infira em silêncio nem releia a fonte**: abra uma nota em `11 Investigations`
  (`tags: consumidor/ddd`) e marque `[⚠️ Pendente: [[Investigação - …]]]`. A síntese nunca
  relê a fonte; ampliar o vault é papel da `/cad:discovery`.
- **Vocabulário proibido:** nada de termos exclusivos da Lean (`MVP`, `persona`,
  `jornada` sentido Lean, `onda`/`sequenciador`, `é-não é-faz-não faz`) nem do Event
  Storming (`hotspot`, `evento-pivô`). O compartilhado com o ES é permitido.
