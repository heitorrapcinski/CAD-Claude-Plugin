---
name: cad-doc-business-rules
description: Gerencia docs/cad/business-rules.md — regras de negócio extraídas das fontes, com condição/gatilho, status e evidência. Neutras por design; consumidas depois por DDD (invariantes de agregados) e outros métodos. Invocado por /cad:discovery e /cad:backlog.
---

# cad-doc-business-rules — Regras de Negócio (substrato neutro)

## Objetivo

Inventariar **regras de negócio** extraídas das fontes, de forma neutra. São a
ponte natural para as **invariantes de agregados** do DDD (`aggregates.md`), mas
aqui ficam descritivas, sem modelagem de método.

## Entradas

- Fontes escaneadas por `/cad:discovery` (código, normativos, docs corporativas).
- `docs/cad/evidence-log.md` — cada regra cita uma `EV-XXX`.

## Template (copiar fielmente)

```markdown
# Regras de Negócio Extraídas

| ID | Regra (paráfrase) | Condição/Gatilho | Fonte | Status | Evidência |
|---|---|---|---|---|---|
| BR-007 | Limite de crédito acima de X exige 2ª alçada | valor > R$ 50k | normativo | confirmado | → EV-014 |
| BR-008 | Cliente inadimplente não recebe nova proposta | flag em cadastro | código | conflitante | → EV-031 |
```

## Como preencher

- `ID` sequencial `BR-NNN`. **Parafraseie** a regra; não copie literal.
- `Condição/Gatilho` torna a regra acionável (limiar, flag, evento).
- `Fonte` indica o nível (normativo/corporativo/código/informal); em conflito,
  aplique a hierarquia e abra `conflito_definição` no backlog.
- `Status`: `confirmado` | `conflitante` | `inferido`. Regra sem evidência clara
  **não entra** — vira `lacuna` no backlog.
- Regra resolvida por humano é protegida; só `/cad:backlog` altera.
- **Sem vocabulário de técnica** aqui — nada de "invariante de agregado",
  "bounded context" etc. Isso é interpretação do DDD, feita em `docs/ddd/`.
