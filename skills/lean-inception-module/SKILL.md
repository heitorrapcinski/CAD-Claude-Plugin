---
name: lean-inception-module
description: Manifesto humano do módulo de técnica Lean Inception (Paulo Caroli). Descreve o método, a pasta de saída (docs/lean-inception/), os artefatos fiéis ao livro e o vocabulário de outras técnicas que é proibido aqui. O contrato enforceável está em module.json.
---

# Módulo de Técnica: Lean Inception (Paulo Caroli)

## O que é

A **Lean Inception** é o workshop de alinhamento de Paulo Caroli para **construir o
produto certo**: parte de uma visão de produto e, através de uma sequência de
atividades colaborativas, chega ao escopo de um **MVP** (Produto Mínimo Viável).
Neste plugin, a Lean Inception é o **primeiro consumidor** do substrato neutro do
CAD: ela **não descobre** fatos — ela **sintetiza** os fatos já descobertos em
`docs/cad/` nos artefatos do método.

## Contrato (ver `module.json`)

- **Técnica:** `lean-inception`
- **Método de origem:** Lean Inception (Paulo Caroli)
- **Pasta de saída (única):** `docs/lean-inception/`
- **Entradas do substrato (únicas leituras):** `knowledge-base.md`,
  `evidence-log.md`, `vocabulary.md`, `business-rules.md`, `capabilities.md`.
- **Artefatos:** `vision.md`, `product-enfn.md`, `objectives.md`, `personas.md`,
  `features.md`, `journeys.md`, `sequencer.md`, `mvp-canvas.md`.
- **Vocabulário proibido** (de outras técnicas, barrado por hook): `bounded
  context`, `agregado / aggregate`, `evento de domínio / domain event`,
  `linguagem ubíqua`.

## Atividades do método e doc-skills correspondentes

| Atividade de Caroli | Artefato(s) | Skill |
|---|---|---|
| Definição do produto (Visão, É-Não é-Faz-Não faz, Objetivos) | `vision.md`, `product-enfn.md`, `objectives.md` | `lean-inception-doc-product-framing` |
| Personas | `personas.md` | `lean-inception-doc-personas` |
| Brainstorming + revisão de funcionalidades (semáforo, E/$/♥) | `features.md` | `lean-inception-doc-features` |
| Jornadas dos usuários | `journeys.md` | `lean-inception-doc-journeys` |
| Sequenciador (ondas, 6 regras, esforço/custo) | `sequencer.md` | `lean-inception-doc-sequencer` |
| Canvas MVP (7 blocos) | `mvp-canvas.md` | `lean-inception-doc-mvp-canvas` |

## Mínimo necessário do substrato (orientação para `/cad:synthesize`)

A definição do produto e as personas precisam de fatos sobre usuários, problema e
benefício no `knowledge-base`/`vocabulary`. Features e jornadas dependem de
capacidades (`capabilities.md`) e regras (`business-rules.md`). O `mvp-canvas.md`
exige objetivos, personas, jornadas e sequenciador já preenchidos. Faltando o
mínimo, **não invente**: abra backlog `consumidor: lean-inception` ou marque
`[⚠️ Pendente: BL-XXX]` no artefato.

## Regras

- Lê só o substrato; escreve só em `docs/lean-inception/`.
- Todo bloco factual carrega `[Fonte: EV-XXX]` ou `[⚠️ Pendente: BL-XXX]`.
- Fidelidade ao livro de Caroli — templates fixos, sem inventar campos.
- Nada de vocabulário de DDD/outras técnicas.
