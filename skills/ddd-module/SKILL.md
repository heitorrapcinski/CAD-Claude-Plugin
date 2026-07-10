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
- **Entradas do substrato (pastas do vault):** `01 Overview/`, `02 Business Knowledge/`,
  `03 Structural Knowledge/`, `05 Source Code/`, `06 Data/`, `09 Evidence/` e
  `11 Investigations/`. As pontes-chave: o **glossário** (`01 Overview`) e os **conceitos**
  (`03 Structural`) → linguagem ubíqua por contexto; as **regras de negócio**
  (`02 Business`) → invariantes dos agregados; as **capacidades** (`02 Business`) →
  subdomínios/bounded contexts; as **entidades/tabelas com campos** (`03 Structural`/
  `06 Data`) → entidades, objetos de valor, atributos e relações dos agregados; os
  **módulos de código** (`05 Source Code`) → mapeamento de bounded context ao código.
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

`subdomains.md` apoia-se nas **capacidades** (`02 Business`); `bounded-contexts.md` precisa
de **módulos de código** evidenciados (`05 Source Code`); `ubiquitous-language.md` consome o
**glossário/conceitos** (`01 Overview`/`03 Structural`) — conflitos (em `11 Investigations`)
viram significados por contexto; `aggregates.md` exige **regras de negócio** (`02 Business`,
invariantes) e `bounded-contexts.md` já preenchidos, e consome as **entidades/tabelas com
campos** (`03 Structural`/`06 Data`) para atributos/relações. Faltando o mínimo, **não
invente**: abra uma nota em `11 Investigations` (`tags: consumidor/ddd`) ou marque
`[⚠️ Pendente: [[Investigação - …]]]`.

## Regras

- Lê só o substrato (vault); escreve só em `docs/ddd/`.
- Todo bloco factual cita a evidência por wikilink — `[[EV-… · resumo|EV-…]]` — ou marca
  `[⚠️ Pendente: [[Investigação - …]]]`.
- Fidelidade a Eric Evans — templates fixos, sem inventar campos.
- Nada de vocabulário da Lean Inception nem assinaturas exclusivas do Event Storming.
