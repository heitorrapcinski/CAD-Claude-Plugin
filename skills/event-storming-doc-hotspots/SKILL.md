---
name: event-storming-doc-hotspots
description: Gera docs/event-storming/hotspots.md — os pontos de tensão do fluxo (problemas, contradições, dúvidas), alimentados pelas investigações e conflitos já registrados no vault (11 Investigations e 09 Evidence), cada um referenciando a nota de origem. Lê só o substrato CAD. Fiel a Alberto Brandolini.
---

# event-storming-doc-hotspots — Hotspots (pontos de tensão)

## Objetivo

Registrar os **hotspots** — os pontos vermelhos do Event Storming: problemas,
contradições e dúvidas do fluxo. No CAD, eles **não são inventados**: derivam
diretamente das **investigações e conflitos já detectados** no vault
(`11 Investigations/` e as evidências em conflito de `09 Evidence/`). É a ponte direta
com o loop humano do CAD.

## Entradas

Lê **apenas** o substrato CAD (Knowledge Vault): `11 Investigations/` (lacunas e conflitos
pendentes) e `09 Evidence/` (evidências em conflito). Localiza os hotspots sobre a
`timeline.md`/`flows.md` (deste módulo). Escreve apenas em `docs/event-storming/`.

## Template (copiar fielmente)

```markdown
# Hotspots — [Sistema/Processo]

> Pontos de tensão do fluxo: problemas, contradições e dúvidas. Alimentados pelas
> investigações e evidências em conflito já registradas no vault.

| ID | Hotspot (problema/dúvida) | Onde no fluxo (evento/comando) | Tipo | Referência |
|---|---|---|---|---|
| HS-01 | "Aprovação": código faz 1 alçada, normativo exige 2 | evento "Pagamento Aprovado" | conflito | [[Investigação - Alçadas de Aprovação]] · [[EV-5-007 · Aprovação exige duas alçadas|EV-5-007]], [[EV-5-011 · Código implementa uma alçada|EV-5-011]] |
| HS-02 | Não se sabe quem dispara o estorno | comando "Estornar" | lacuna | [[Investigação - Gatilho do estorno]] |

> Cada hotspot referencia a nota de `11 Investigations` ou as evidências em conflito
> (`09 Evidence`) que o originaram — a resolução se dá via `/cad:backlog`.
```

## Como preencher

- **Todo hotspot vem do substrato.** Cada linha referencia a nota de origem em
  `11 Investigations` (`[[Investigação - …]]`) e/ou as evidências em conflito de
  `09 Evidence` (`[[EV-…|EV-…]]`) — nunca um hotspot sem lastro no que já foi detectado.
- **Onde no fluxo:** ancore o hotspot num evento ou comando concreto da
  `timeline.md`/`flows.md`.
- **Tipo:** `conflito` (divergência entre fontes — investigação `status: conflicting` ou
  `conflito_pós_validação`) ou `lacuna` (investigação `status: open`).
- **Resolução.** O hotspot não se resolve aqui — a resolução é do consultor via
  `/cad:backlog`; este artefato só o **torna visível** no mapa do fluxo.
- **Vocabulário proibido:** nada de termos exclusivos da Lean ou só-DDD. O termo
  `hotspot` e `evento-pivô` são assinaturas **próprias** do Event Storming (e
  barrados no DDD, não aqui).
