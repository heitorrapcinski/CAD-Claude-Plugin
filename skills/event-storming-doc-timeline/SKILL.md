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

Lê **apenas** o substrato CAD: `knowledge-base.md` e `evidence-log.md` (eventos com
origem), `business-rules.md` e `capabilities.md` (fases do processo). Escreve apenas
em `docs/event-storming/`.

## Template (copiar fielmente)

```markdown
# Linha do Tempo de Eventos de Domínio — [Sistema/Processo]

> Eventos de domínio no **passado**, em ordem cronológica. Eventos-pivô marcam
> transições e sugerem fronteiras de contexto (ver boundaries.md).

| # | Evento de domínio (passado) | Fase | Pivô? | Origem (código/fila/API/BD) | Evidência |
|---|---|---|---|---|---|
| 1 | Pedido Registrado | Captação | — | POST /orders → OrderCreated | → EV-071 |
| 2 | Pagamento Aprovado | Pagamento | ⭐ | fila `payments.approved` | → EV-072 |
| 3 | Pedido Faturado | Faturamento | — | billing/service.py L88 | → EV-073 |

> Evento sem origem rastreável: [⚠️ Pendente: BL-XXX] (consumidor: event-storming).
```

## Como preencher

- **Evento no passado.** Todo evento é um fato consumado, nomeado no particípio
  (`Pedido Registrado`, `Pagamento Aprovado`), nunca um comando no imperativo.
- **Ordem cronológica** por linha; agrupe por `Fase` do processo.
- **Origem + evidência.** Cada evento cita a origem concreta (endpoint, fila,
  arquivo/linha, tabela) e `→ EV-XXX` do `evidence-log.md`.
- **Pivô (⭐).** Marque como pivô o evento que fecha uma fase e abre outra — é o que
  sugere uma fronteira candidata em `boundaries.md`. Ser pivô é **julgamento do
  método**, não descoberta crua.
- **Lacuna de detalhe fino** (ex.: falta a origem exata de um evento que um `EV` já
  aponta): **não infira em silêncio**. Sinalize a lacuna com o **ponteiro de `EV`**
  existente para o orquestrador aprofundar: se a fonte já está autorizada
  e `pode_aprofundar = "fontes-autorizadas"`, a descoberta relê o trecho e grava um
  `EV` novo e neutro; senão, abra `[⚠️ Pendente: BL-XXX]` (consumidor:
  event-storming).
- **Vocabulário proibido:** nada de termos exclusivos da Lean (`MVP`, `persona`,
  `onda`/`sequenciador`) ou só-DDD (`linguagem ubíqua`, `objeto de valor`,
  `repositório`, `subdomínio`, `ACL/OHS/mapa de contextos`). `domain event`,
  `command`, `aggregate` etc. são compartilhados e permitidos.
