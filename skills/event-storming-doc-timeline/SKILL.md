---
name: event-storming-doc-timeline
description: Gera docs/event-storming/timeline.md — a linha do tempo de eventos de domínio (no passado) em ordem cronológica, marcando os eventos-pivô que sugerem fronteiras de contexto. Lê só o substrato CAD. Fiel a Alberto Brandolini.
---

# event-storming-doc-timeline — Linha do Tempo de Eventos de Domínio

## Objetivo

Reconstruir a **espinha dorsal** do Event Storming: os **eventos de domínio** no
**passado**, em ordem cronológica, com sua origem rastreável (código, fila, API,
banco). Marcar os **eventos-pivô** — os que marcam transição de fase e sugerem
fronteiras de contexto (insumo para `boundaries.md`).

## Entradas

Lê **apenas** o substrato CAD (Knowledge Vault): `04 Behavioral Knowledge/` (fluxos,
eventos, jobs — os eventos com origem), `02 Business Knowledge/` (fases do processo) e as
notas de **evidência** (`09 Evidence/`). Escreve apenas em `docs/event-storming/`. Cada
bloco factual cita a evidência por `[[EV-… · resumo|EV-…]]`.

## Template (copiar fielmente)

```markdown
# Linha do Tempo de Eventos de Domínio — [Sistema/Processo]

> Eventos de domínio no **passado**, em ordem cronológica. Eventos-pivô marcam
> transições e sugerem fronteiras de contexto (ver boundaries.md).

| # | Evento de domínio (passado) | Fase | Pivô? | Origem (código/fila/API/BD) | Evidência |
|---|---|---|---|---|---|
| 1 | Pedido Registrado | Captação | — | POST /orders → OrderCreated | [[EV-5-071 · POST /orders|EV-5-071]] |
| 2 | Pagamento Aprovado | Pagamento | ⭐ | fila `payments.approved` | [[EV-5-072 · Fila payments.approved|EV-5-072]] |
| 3 | Pedido Faturado | Faturamento | — | billing/service.py L88 | [[EV-5-073 · billing/service.py|EV-5-073]] |

> Evento sem origem rastreável: [⚠️ Pendente: [[Investigação - Origem do evento …]]] (consumidor: event-storming).
```

## Como preencher

- **Evento no passado.** Todo evento é um fato consumado, nomeado no particípio
  (`Pedido Registrado`, `Pagamento Aprovado`), nunca um comando no imperativo.
- **Ordem cronológica** por linha; agrupe por `Fase` do processo.
- **Origem + evidência.** Cada evento cita a origem concreta (endpoint, fila,
  arquivo/linha, tabela) e a evidência por `[[EV-…|EV-…]]` (nota de `09 Evidence`).
- **Pivô (⭐).** Marque como pivô o evento que fecha uma fase e abre outra — é o que
  sugere uma fronteira candidata em `boundaries.md`. Ser pivô é **julgamento do
  método**, não descoberta crua.
- **Faltou no vault → investigação, nunca releitura de fonte.** Se falta a origem exata
  de um evento: **não infira em silêncio nem leia a fonte** — abra uma nota em
  `11 Investigations` (`tags: consumidor/event-storming`) e marque
  `[⚠️ Pendente: [[Investigação - …]]]`. Ampliar o vault é papel da `/cad:discovery`.
- **Vocabulário proibido:** nada de termos exclusivos da Lean (`MVP`, `persona`,
  `onda`/`sequenciador`) ou só-DDD (`linguagem ubíqua`, `objeto de valor`,
  `repositório`, `subdomínio`, `ACL/OHS/mapa de contextos`). `domain event`,
  `command`, `aggregate` etc. são compartilhados e permitidos.
