---
name: cad-doc-business
description: Gera as notas de Knowledge das pastas 01 Overview (o que é o sistema) e 02 Business Knowledge (por que existe) do vault docs/cad/ — visão geral, glossário, stakeholders, tecnologias; processos, capacidades, regras de negócio, papéis, eventos de negócio. Notas Zettelkasten neutras, rastreadas por evidência. Invocado por /cad:discovery e /cad:backlog.
---

# cad-doc-business — Overview & Business Knowledge (01–02)

## Objetivo

Produzir as notas que respondem **"o que é o sistema?"** (`01 Overview`) e **"por que ele
existe?"** (`02 Business Knowledge`) — o **domínio do problema**, não a implementação
técnica. Conhecimento **neutro**: sem opinião de método.

Segue as [convenções do vault](../cad-doc-conventions/SKILL.md) — frontmatter, componentes,
`source:` ligando a `09 Evidence`, taxonomia, vocabulário proibido.

## Entradas

- Fontes escaneadas por `/cad:discovery` (no escopo declarado pelo consultor).
- Notas de `09 Evidence` já criadas (para ligar via `source:`).

## Pastas e notas

- **`01 Overview/`** — visão geral do sistema. Notas típicas: `Overview.md`, `Purpose.md`
  (objetivo), `Scope.md` (escopo), `History.md` (histórico), `Stakeholders.md`,
  `Glossary.md` (glossário do domínio), `Technologies.md` (tecnologias utilizadas), e uma
  nota por funcionalidade principal.
- **`02 Business Knowledge/`** — conhecimento de negócio. Uma nota por: processo de negócio
  (`Cadastro de Cliente.md`), capacidade, regra de negócio (`Regra - Limite de Crédito.md`),
  papel de usuário, evento de negócio, objetivo organizacional.

## Template de nota

### Conceito/funcionalidade/processo (01 Overview, 02 Business)

```markdown
---
title: Cadastro de Cliente
aliases: [Onboarding de Cliente]
tags: [dominio/cadastro, processo]
type: process
status: confirmed
source: "[[EV-5-a1-003 · Cliente é cadastrado antes de operar|EV-5-a1-003]]"
author: CAD Discovery
created: 2026-07-10
---

# Cadastro de Cliente

> [!note] O que é
Processo pelo qual um novo cliente é registrado no sistema antes de operar.

## Passos
1. …
2. …

## Regras aplicáveis
- [[Regra - Limite de Crédito]]

## Relacionado
- Executado por [[Atendente]] · produz [[Cliente]]
```

### Regra de negócio (02 Business)

```markdown
---
title: Regra - Limite de Crédito
tags: [regra, credito]
type: rule
status: confirmed
source: "[[EV-5-a2-007 · Aprovação exige duas alçadas|EV-5-a2-007]]"
author: CAD Discovery
created: 2026-07-10
---

# Regra - Limite de Crédito

**Condição/gatilho:** quando o valor solicitado excede o limite aprovado.
**Efeito:** a proposta segue para aprovação em alçada superior.

## Relacionado
- Aplica-se a [[Emissão de Documento]] · avaliada sobre [[Proposta]]
```

## Como preencher

- **Parafraseie**, nunca copie literalmente a fonte (especialmente normativos e documentos
  corporativos protegidos). O trecho literal, quando necessário, vive na nota de `09 Evidence`.
- Toda nota confirmada/inferida traz `source:` apontando para `09 Evidence`. Sem evidência,
  **não escreva a nota** — abra `11 Investigations` (via `cad-doc-investigations`).
- `status`: `confirmed` (evidência direta), `inferred` (derivado — marque a inferência),
  `conflicting` (divergência entre fontes — registre a versão priorizada pela hierarquia e
  abra investigação).
- **Glossário** (`01 Overview/Glossary.md` ou notas de termo): registre o termo, a
  definição priorizada e, havendo divergência, abra `11 Investigations`. O recorte por
  contexto (bounded context) é opinião de método — **não** entra aqui.
- **Vocabulário proibido:** nenhum conceito de técnica (bounded context, MVP, persona,
  agregado, jornada Lean…). Isto é substrato neutro.
