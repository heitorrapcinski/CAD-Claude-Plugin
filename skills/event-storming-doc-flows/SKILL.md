---
name: event-storming-doc-flows
description: Gera docs/event-storming/flows.md — as fatias da gramática do Event Storming (Ator → Comando → Agregado → Evento → Read Model → Política), com comandos no imperativo e eventos no passado. Lê só o substrato CAD. Fiel a Alberto Brandolini.
---

# event-storming-doc-flows — Fluxos (fatias da gramática)

## Objetivo

Descer da linha do tempo ao **nível de design**: para cada comando principal,
montar a **fatia** completa da gramática de Brandolini — **Ator → Comando →
Agregado → Evento(s) de domínio → Read Model → Política**. É onde a mecânica do
fluxo fica explícita.

## Entradas

Lê **apenas** o substrato CAD: `knowledge-base.md`, `evidence-log.md`,
`business-rules.md` (→ políticas) e `vocabulary.md`. Usa a `timeline.md` (deste
módulo) como referência dos eventos. Escreve apenas em `docs/event-storming/`.

## Template (seção 8.4 — copiar fielmente)

```markdown
# Fluxos — [Processo]

> Cada fatia: **Ator → Comando → Agregado → Evento(s) de domínio → Read Model →
> Política**. Comando no imperativo; evento no passado.

## Fatia: [comando principal]
- **Ator:** [quem dispara] [Fonte: EV-XXX]
- **Comando:** [Registrar Pedido] (imperativo) [Fonte: EV-XXX]
- **Agregado:** [Pedido] — recebe o comando e garante a consistência [Fonte: EV-XXX]
- **Evento(s):** [Pedido Registrado] (→ timeline.md) [Fonte: EV-XXX]
- **Read model (decisão):** [dado consultado antes de decidir] [Fonte: EV-XXX | ⚠️ Pendente: BL-XXX]
- **Política (reação):** "sempre que [Pagamento Aprovado] → [Faturar Pedido]"
  (→ business-rules.md#BR-XXX) [Fonte: EV-XXX]
```

## Como preencher

- Uma seção `## Fatia:` por comando principal. **Comando no imperativo**
  (`Registrar Pedido`); **evento no passado** (`Pedido Registrado`).
- **Política** referencia a regra de negócio de origem
  (`→ business-rules.md#BR-XXX`) e cita `EV-XXX` — é a ponte com o substrato.
- **Read model** é o dado consultado **antes de decidir**; se não há evidência de
  qual dado embasa a decisão, marque `[⚠️ Pendente: BL-XXX]`.
- **Lacuna de detalhe fino** (ex.: falta saber qual agregado recebe o comando, e um
  `EV` já aponta ao código): **não infira em silêncio**. Sinalize a lacuna com o
  **ponteiro de `EV`** para o orquestrador aprofundar (seção 5.1); fonte nova →
  `[⚠️ Pendente: BL-XXX]` (consumidor: event-storming).
- **Vocabulário proibido:** nada de termos exclusivos da Lean ou só-DDD (`objeto de
  valor`, `repositório`, `linguagem ubíqua`, `subdomínio`, `ACL/OHS/mapa de
  contextos`). `aggregate`, `command`, `policy`, `read model`, `domain event` são
  compartilhados e permitidos.
