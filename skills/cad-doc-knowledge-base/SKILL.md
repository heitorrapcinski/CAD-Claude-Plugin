---
name: cad-doc-knowledge-base
description: Gerencia docs/cad/knowledge-base.md — fatos extraídos das fontes, organizados por domínio/subdomínio, cada afirmação parafraseada e ligada a uma evidência rastreável. Camada neutra do substrato CAD, invocada por /cad:discovery e /cad:backlog.
---

# cad-doc-knowledge-base — Base de Conhecimento (substrato neutro)

## Objetivo

Registrar **fatos descritivos** extraídos das fontes, organizados por domínio e
subdomínio. É conhecimento **neutro** — sem opinião de método (priorizar,
sequenciar, delimitar contextos é dos módulos de técnica, não daqui).

## Entradas

- Fontes escaneadas por `/cad:discovery` (no escopo declarado pelo consultor).
- `docs/cad/evidence-log.md` — toda afirmação aponta para uma `EV-XXX`.

## Template (copiar fielmente)

```markdown
# Base de Conhecimento — [Domínio]

## [Subdomínio: ex. Aprovação de Crédito]
- **Afirmação:** [paráfrase, nunca cópia literal da fonte]
  - Status: confirmado | inferido | conflitante
  - Evidência: → evidence-log.md#EV-014
  - Sessão: 2
```

## Como preencher

- **Parafraseie**, nunca copie literalmente a fonte (especialmente normativos e
  documentos corporativos protegidos).
- Toda afirmação carrega `Evidência: → evidence-log.md#EV-XXX`. Sem evidência,
  **não registre o fato** — abra item via `cad-doc-backlog`.
- `Status`: `confirmado` (evidência direta), `inferido` (derivado, marque a
  inferência), `conflitante` (há divergência entre fontes — registre o conflito
  em `vocabulary.md`/`business-rules.md` e abra backlog).
- Em conflito entre fontes, a **hierarquia** (Normativo > Corporativo > Código >
  Informal) define a versão priorizada; nunca esconda as divergências.
- **Não sobrescreva** blocos de origem "validação humana" (princípio 7); conflito
  novo abre `conflito_pós_validação`.
- **Vocabulário proibido:** nenhum conceito de técnica (bounded context, MVP,
  persona, agregado, jornada…) entra aqui — isto é substrato neutro.
