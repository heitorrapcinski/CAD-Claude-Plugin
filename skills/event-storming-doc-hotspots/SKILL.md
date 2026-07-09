---
name: event-storming-doc-hotspots
description: Gera docs/event-storming/hotspots.md — os pontos de tensão do fluxo (problemas, contradições, dúvidas), alimentados pelos conflitos e lacunas já detectados no substrato (backlog.md e evidence-log.md), cada um referenciando o BL-XXX/EV-XXX de origem. Lê só o substrato CAD. Fiel a Alberto Brandolini.
---

# event-storming-doc-hotspots — Hotspots (pontos de tensão)

## Objetivo

Registrar os **hotspots** — os pontos vermelhos do Event Storming: problemas,
contradições e dúvidas do fluxo. No CAD, eles **não são inventados**: derivam
diretamente dos **conflitos e lacunas já detectados** no substrato (`backlog.md` e
`evidence-log.md`). É a ponte direta com o loop humano do CAD.

## Entradas

Lê **apenas** o substrato CAD: `backlog.md` (lacunas e conflitos pendentes) e
`evidence-log.md` (evidências em conflito). Localiza os hotspots sobre a
`timeline.md`/`flows.md` (deste módulo). Escreve apenas em `docs/event-storming/`.

## Template (copiar fielmente)

```markdown
# Hotspots — [Sistema/Processo]

> Pontos de tensão do fluxo: problemas, contradições e dúvidas. Alimentados pelos
> conflitos e lacunas já detectados (evidence-log.md e backlog.md).

| ID | Hotspot (problema/dúvida) | Onde no fluxo (evento/comando) | Tipo | Referência |
|---|---|---|---|---|
| HS-01 | "Aprovação": código faz 1 alçada, normativo exige 2 | evento "Pagamento Aprovado" | conflito | → BL-004 / EV-014, EV-015 |
| HS-02 | Não se sabe quem dispara o estorno | comando "Estornar" | lacuna | → BL-012 |

> Cada hotspot referencia o item de backlog ou as evidências em conflito que o
> originaram — a resolução se dá via `/cad:backlog`.
```

## Como preencher

- **Todo hotspot vem do substrato.** Cada linha referencia o `BL-XXX` de origem
  (`backlog.md`) e/ou as `EV-XXX` em conflito (`evidence-log.md`) — nunca um hotspot
  sem lastro no que já foi detectado.
- **Onde no fluxo:** ancore o hotspot num evento ou comando concreto da
  `timeline.md`/`flows.md`.
- **Tipo:** `conflito` (divergência entre fontes → `conflito_definição`/
  `conflito_pós_validação` do backlog) ou `lacuna` (`tipo: lacuna` do backlog).
- **Resolução.** O hotspot não se resolve aqui — a resolução é do consultor via
  `/cad:backlog`; este artefato só o **torna visível** no mapa do fluxo.
- **Vocabulário proibido:** nada de termos exclusivos da Lean ou só-DDD. O termo
  `hotspot` e `evento-pivô` são assinaturas **próprias** do Event Storming (e
  barrados no DDD, não aqui).
