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

Lê **apenas** o substrato CAD (Knowledge Vault): `07 Integrations/` (sistemas externos),
`04 Behavioral Knowledge/` (eventos) e as notas de **evidência** (`09 Evidence/`). Usa os
eventos-pivô de `timeline.md` (deste módulo). Escreve apenas em `docs/event-storming/`.

## Template (copiar fielmente)

```markdown
# Fronteiras e Sistemas Externos — [Sistema]

## Contextos candidatos (a partir dos eventos-pivô)
> Agrupar os eventos entre pivôs sugere fronteiras candidatas — insumo para o DDD
> (bounded-contexts.md), que as refina. Aqui são apenas candidatas.

| Contexto candidato | Eventos incluídos | Delimitado até o pivô | Evidência |
|---|---|---|---|
| Captação de Pedidos | Pedido Registrado, … | "Pagamento Aprovado" | [[EV-5-071 · POST /orders|EV-5-071]], [[EV-5-072 · Fila payments.approved|EV-5-072]] |

## Sistemas externos
> Sistemas externos (rosa) que emitem ou consomem eventos do fluxo.

| Sistema externo | Emite / Consome | Evento(s) | Evidência |
|---|---|---|---|
| Gateway de Pagamento | emite | Pagamento Aprovado / Recusado | [[EV-5-072 · Fila payments.approved|EV-5-072]] |
```

## Como preencher

- **Contextos candidatos:** agrupe os eventos da `timeline.md` **entre** dois
  eventos-pivô; o pivô que fecha o grupo é a fronteira candidata. Cite as evidências
  (`[[EV-…|EV-…]]`) dos eventos incluídos. São **candidatos** — o DDD decide a fronteira final.
- **Sistemas externos:** liste quem **emite** ou **consome** eventos do fluxo
  (gateways, filas de terceiros, integrações) — a partir de `07 Integrations/` — com o(s)
  evento(s) e a evidência por wikilink.
- **Faltou no vault → investigação, nunca releitura de fonte.** Se falta confirmar qual
  sistema emite um evento: **não infira em silêncio nem leia a fonte** — abra uma nota em
  `11 Investigations` (`tags: consumidor/event-storming`) e marque
  `[⚠️ Pendente: [[Investigação - …]]]`.
- **Vocabulário proibido:** nada de termos exclusivos da Lean ou só-DDD. Em
  particular, **não** classifique subdomínios (Core/Supporting/Generic) nem padrões
  de integração (ACL/OHS/mapa de contextos) — isso é DDD. `bounded context` é termo
  compartilhado e pode ser citado como destino do insumo.
