---
name: ddd-module
description: Manifesto humano do módulo de técnica Domain-Driven Design (Eric Evans). Descreve o método, a pasta de saída (docs/ddd/), os cinco artefatos estratégicos/táticos e o vocabulário Lean proibido aqui. O contrato enforceável está em module.json.
---

# Módulo de Técnica: Domain-Driven Design (Eric Evans)

## O que é

**Domain-Driven Design (DDD)** é a abordagem de Eric Evans para modelar software a
partir do domínio: identificar **subdomínios** (espaço do problema), delimitar
**bounded contexts** (espaço da solução), explicitar a **linguagem ubíqua** por
contexto, mapear as **relações entre contextos** e modelar os **agregados**
táticos. Neste plugin, o DDD é o **segundo consumidor** do substrato CAD — ele
**interpreta** os fatos neutros; **não descobre** fatos novos. A classificação
(Core/Supporting/Generic, limites de contexto, padrões de integração) é **opinião
do método**.

## Contrato (ver `module.json`)

- **Técnica:** `ddd`
- **Método de origem:** Domain-Driven Design (Eric Evans)
- **Pasta de saída (única):** `docs/ddd/`
- **Entradas do substrato:** `knowledge-base.md`, `evidence-log.md`,
  `vocabulary.md`, `business-rules.md`, `capabilities.md`, `data-structures.md`. As
  pontes-chave são `vocabulary` (→ linguagem ubíqua por contexto), `business-rules`
  (→ invariantes dos agregados), `capabilities` (→ subdomínios/bounded contexts) e
  `data-structures` (→ entidades, objetos de valor, atributos e relações dos agregados).
- **Artefatos:** `subdomains.md`, `bounded-contexts.md`, `ubiquitous-language.md`,
  `context-map.md`, `aggregates.md`.
- **Vocabulário proibido** (assinaturas **exclusivas** de outras técnicas, barradas
  por hook): da Lean — `MVP / canvas MVP`, `persona / persona segmentada`, `jornada
  (no sentido Lean)`, `onda / sequenciador`, `é-não é-faz-não faz`; do Event Storming
  — `hotspot`, `evento-pivô / pivotal event`. O vocabulário **compartilhado** com o
  Event Storming (`aggregate`, `domain event`, `command`, `policy`, `read model`,
  `bounded context`) é legítimo aqui.

## Artefatos e doc-skills correspondentes

| Espaço | Artefato(s) | Skill |
|---|---|---|
| Estratégico | `subdomains.md`, `bounded-contexts.md`, `context-map.md` | `ddd-doc-strategic` |
| Linguagem | `ubiquitous-language.md` | `ddd-doc-ubiquitous-language` |
| Tático | `aggregates.md` | `ddd-doc-tactical` |

## Mínimo necessário do substrato (orientação para `/cad:synthesize`)

`subdomains.md` apoia-se em `capabilities.md`; `bounded-contexts.md` precisa de
módulos de código evidenciados; `ubiquitous-language.md` consome `vocabulary.md`
(conflitos viram significados por contexto); `aggregates.md` exige
`business-rules.md` (invariantes) e `bounded-contexts.md` já preenchidos, e consome
`data-structures.md` para atributos/relações (na falta, cai no aprofundamento sob
demanda). Faltando
o mínimo, **não invente**: abra backlog `consumidor: ddd` ou marque
`[⚠️ Pendente: BL-XXX]`.

## Regras

- Lê só o substrato; escreve só em `docs/ddd/`.
- Todo bloco factual carrega `[Fonte: EV-XXX]` ou `[⚠️ Pendente: BL-XXX]`.
- Fidelidade a Eric Evans — templates fixos, sem inventar campos.
- Nada de vocabulário da Lean Inception.
