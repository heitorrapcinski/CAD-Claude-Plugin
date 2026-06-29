---
name: ddd-doc-tactical
description: Gera docs/ddd/aggregates.md — blocos táticos por contexto (agregados, entidades, objetos de valor, invariantes consumindo business-rules.md, eventos de domínio e repositórios). Lê só o substrato CAD. Fiel a Eric Evans.
---

# ddd-doc-tactical — DDD Tático (Agregados)

## Objetivo

Modelar os **blocos táticos** por bounded context: **agregados** (com raiz),
**entidades**, **objetos de valor**, **invariantes** (consumindo
`business-rules.md`), **eventos de domínio** publicados e **repositórios**.

## Entradas

Lê **apenas** o substrato CAD: `business-rules.md` (→ invariantes),
`knowledge-base.md`, `vocabulary.md` e `evidence-log.md`. Usa os contextos de
`bounded-contexts.md` (deste módulo). Escreve apenas em `docs/ddd/`. Exige
`business-rules.md` e `bounded-contexts.md` já preenchidos.

## Template (seção 8.3 — copiar fielmente)

```markdown
# Agregados — Contexto [Nome]

## Agregado: [Raiz do Agregado]
- **Raiz (entidade):** [ex.: Proposta] [Fonte: EV-XXX]
- **Entidades:** [ex.: ItemDaProposta] [Fonte: EV-XXX]
- **Objetos de valor:** [ex.: Valor, CPF, Período] [Fonte: EV-XXX]
- **Invariantes (regras que o agregado protege):** [ex.: total = soma dos itens]
  (→ business-rules.md#BR-007) [Fonte: EV-XXX]
- **Eventos de domínio publicados:** [ex.: PropostaAprovada, PropostaRecusada] [Fonte: EV-XXX]
- **Repositório:** [ex.: PropostaRepository] [Fonte: EV-XXX]
- **Incerteza de modelagem:** [⚠️ Pendente: BL-XXX] — [ex.: fronteira do agregado a confirmar]

> Eventos de domínio aqui são os do **modelo tático** (publicados por um agregado).
> A linha do tempo de processo/descoberta de eventos candidatos em filas e APIs é
> escopo do futuro módulo **Event Storming**, não deste — evitando sobreposição.
```

## Como preencher

- Um arquivo/`# Agregados — Contexto [Nome]` por bounded context; uma seção
  `## Agregado:` por agregado, sempre com a **raiz**.
- **Invariantes** referenciam `business-rules.md#BR-XXX` (a ponte do substrato) e
  citam `EV-XXX`.
- **Eventos de domínio** aqui são os do **modelo tático** (publicados por um
  agregado). **Não** modele a descoberta de eventos em filas/APIs/processos — isso
  é **Event Storming** (módulo futuro), fora deste escopo, para evitar sobreposição.
- Fronteira/modelagem incerta → `Incerteza de modelagem: [⚠️ Pendente: BL-XXX]`
  (consumidor: `ddd`); nada de inferência silenciosa.
- **Vocabulário proibido (Lean):** nada de `MVP`, `persona`, `jornada` (sentido
  Lean), `onda`/`sequenciador`, `é-não é-faz-não faz`.
