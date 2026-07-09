---
name: cad-doc-capabilities
description: Gerencia docs/cad/capabilities.md — inventário PLANO de capacidades de negócio/sistema, com tipo, evidência e observações. Neutro; o mapa hierárquico/heat map é técnica própria (BCM). Invocado por /cad:discovery e /cad:backlog.
---

# cad-doc-capabilities — Inventário de Capacidades (substrato neutro)

## Objetivo

Listar as **capacidades** de negócio e de sistema descobertas, de forma **plana**
e neutra. É a ponte para subdomínios do DDD e para Wardley/BCM no futuro — mas
aqui é só descoberta: **sem** mapa hierárquico ou heat map (isso é o método BCM).

## Entradas

- Fontes escaneadas por `/cad:discovery`.
- `docs/cad/evidence-log.md` — cada capacidade cita uma `EV-XXX`.

## Template (copiar fielmente)

```markdown
# Inventário de Capacidades

| ID | Capacidade | Tipo | Evidência | Observações |
|---|---|---|---|---|
| CAP-003 | Análise de risco de crédito | negócio | → EV-040 | parcialmente automatizada |
| CAP-004 | Notificação ao cliente | sistema | → EV-041 | via fila SQS |
```

## Como preencher

- `ID` sequencial `CAP-NNN`. `Tipo`: `negócio` ou `sistema`.
- `Observações` registra fatos descritivos (grau de automação, integração, fila),
  sempre lastreados na evidência — sem juízo de valor metodológico.
- Capacidade sem evidência **não entra** — vira `lacuna` no backlog.
- **Inventário plano:** não organize em hierarquia, níveis ou heat map; essa
  estruturação é o método **Business Capability Mapping** (consumidor futuro),
  não o substrato.
- Bloco resolvido por humano é protegido (princípio 7); só `/cad:backlog` altera.
