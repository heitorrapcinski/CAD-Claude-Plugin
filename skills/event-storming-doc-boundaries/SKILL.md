---
name: event-storming-doc-boundaries
description: Gera docs/event-storming/boundaries.md — as fronteiras de contexto candidatas (agrupando os eventos entre os eventos-pivô) e os sistemas externos que emitem/consomem eventos do fluxo. Insumo para o DDD, que as refina. Lê só o substrato CAD. Fiel a Alberto Brandolini.
---

# event-storming-doc-boundaries — Fronteiras e Sistemas Externos

## Objetivo

A partir dos **eventos-pivô** da `timeline.md`, propor **contextos candidatos**
(agrupando os eventos entre pivôs) e inventariar os **sistemas externos** que
emitem ou consomem eventos do fluxo. São apenas **candidatos** — insumo para o
`bounded-contexts.md` do DDD, que os refina; aqui não há modelagem.

## Entradas

Lê **apenas** o substrato CAD: `knowledge-base.md`, `evidence-log.md` e
`capabilities.md` (sistemas). Usa os eventos-pivô de `timeline.md` (deste módulo).
Escreve apenas em `docs/event-storming/`.

## Template (seção 8.4 — copiar fielmente)

```markdown
# Fronteiras e Sistemas Externos — [Sistema]

## Contextos candidatos (a partir dos eventos-pivô)
> Agrupar os eventos entre pivôs sugere fronteiras candidatas — insumo para o DDD
> (bounded-contexts.md), que as refina. Aqui são apenas candidatas.

| Contexto candidato | Eventos incluídos | Delimitado até o pivô | Evidência |
|---|---|---|---|
| Captação de Pedidos | Pedido Registrado, … | "Pagamento Aprovado" | → EV-071, EV-072 |

## Sistemas externos
> Sistemas externos (rosa) que emitem ou consomem eventos do fluxo.

| Sistema externo | Emite / Consome | Evento(s) | Evidência |
|---|---|---|---|
| Gateway de Pagamento | emite | Pagamento Aprovado / Recusado | → EV-072 |
```

## Como preencher

- **Contextos candidatos:** agrupe os eventos da `timeline.md` **entre** dois
  eventos-pivô; o pivô que fecha o grupo é a fronteira candidata. Cite as `EV-XXX`
  dos eventos incluídos. São **candidatos** — o DDD decide a fronteira final.
- **Sistemas externos:** liste quem **emite** ou **consome** eventos do fluxo
  (gateways, filas de terceiros, integrações), com o(s) evento(s) e `EV-XXX`.
- **Lacuna de detalhe fino** (ex.: falta confirmar qual sistema emite um evento, e
  um `EV` já aponta à integração): **não infira em silêncio**. Sinalize com o
  **ponteiro de `EV`** para o orquestrador aprofundar (seção 5.1); fonte nova →
  `[⚠️ Pendente: BL-XXX]` (consumidor: event-storming).
- **Vocabulário proibido:** nada de termos exclusivos da Lean ou só-DDD. Em
  particular, **não** classifique subdomínios (Core/Supporting/Generic) nem padrões
  de integração (ACL/OHS/mapa de contextos) — isso é DDD. `bounded context` é termo
  compartilhado e pode ser citado como destino do insumo.
