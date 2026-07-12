---
name: event-storming-module
description: Manifesto humano do módulo de técnica Event Storming (Alberto Brandolini). Descreve o método, a pasta de saída (docs/event-storming/), os quatro artefatos (timeline, flows, hotspots, boundaries) e o vocabulário exclusivo de outras técnicas proibido aqui. O contrato enforceável está em module.json.
---

# Módulo de Técnica: Event Storming (Alberto Brandolini)

## O que é

**Event Storming** é a técnica de workshop de Alberto Brandolini para explorar um
domínio de negócio a partir dos **eventos de domínio** — fatos relevantes que já
aconteceram, escritos no **passado**. A partir da linha do tempo desses eventos,
o grupo descobre os **comandos** que os provocam, os **atores** que disparam os
comandos, os **agregados** que garantem consistência, as **políticas** (reações do
tipo "sempre que… então…"), os **read models** que embasam decisões, os **sistemas
externos** e — vermelhos, impossíveis de ignorar — os **hotspots**: os pontos de
tensão, contradição e dúvida.

Neste plugin, o Event Storming é o **terceiro consumidor** do substrato neutro do
CAD. Ele **interpreta** os fatos já descobertos em `docs/knowledge-vault/` como uma linha do
tempo colaborativa; **não descobre** fatos novos por conta própria. O que é opinião
do método — o que é um **evento-pivô**, onde ficam as **fronteiras candidatas** — é
julgamento do Event Storming, não descoberta crua.

## Contrato (ver `module.json`)

- **Técnica:** `event-storming`
- **Método de origem:** Event Storming (Alberto Brandolini)
- **Pasta de saída (única):** `docs/event-storming/`
- **Entradas do substrato (pastas do vault):** `02 Business Knowledge/` (regras →
  políticas), `03 Structural Knowledge/` (agregados/read models/conceitos),
  `04 Behavioral Knowledge/` (fluxos/eventos/jobs → timeline e fatias),
  `07 Integrations/` (filas/APIs/sistemas externos → boundaries), `09 Evidence/` e —
  fonte dos **hotspots** — `11 Investigations/` (conflitos e lacunas já registrados).
- **Artefatos:** `timeline.md`, `flows.md`, `hotspots.md`, `boundaries.md`.
- **Vocabulário proibido** (assinaturas **exclusivas** de outras técnicas, barradas
  por hook): termos da Lean (`MVP / canvas MVP`, `persona / persona segmentada`,
  `onda / sequenciador`) e os blocos **só-DDD** (`linguagem ubíqua`, `objeto de
  valor / value object`, `repositório / repository`, `subdomínio
  (Core/Supporting/Generic)`, `anticorruption layer / open host service / context
  map`).

> **Vocabulário compartilhado × exclusivo.** Event Storming e DDD são
> técnicas **complementares** (Brandolini e Evans se alinham). Por isso os termos
> `aggregate`, `domain event`, `command`, `policy`, `read model` e `bounded context`
> são **compartilhados** — legítimos nos dois — e **não** entram no vocabulário
> proibido de nenhum deles. Barram-se apenas as assinaturas **exclusivas** de cada
> técnica.

## Artefatos e doc-skills correspondentes

| Nível | Artefato | Skill |
|---|---|---|
| Espinha dorsal | `timeline.md` (eventos de domínio + eventos-pivô) | `event-storming-doc-timeline` |
| Design | `flows.md` (ator → comando → agregado → evento → read model → política) | `event-storming-doc-flows` |
| Tensão | `hotspots.md` (conflitos/dúvidas, vindos de `11 Investigations`) | `event-storming-doc-hotspots` |
| Fronteiras | `boundaries.md` (contextos candidatos + sistemas externos) | `event-storming-doc-boundaries` |

## Mínimo necessário do substrato (orientação para `/cad:synthesize`)

`timeline.md` apoia-se em `04 Behavioral Knowledge/` e `09 Evidence/` (eventos com origem
rastreável em código/filas/APIs/BD). `flows.md` precisa da timeline e das **regras de
negócio** (`02 Business Knowledge/`) para as políticas. `hotspots.md` consome
`11 Investigations/` (conflitos e lacunas já detectados). `boundaries.md` depende dos
eventos-pivô de `timeline.md` e das integrações (`07 Integrations/`). Faltando o mínimo,
**não invente**: abra uma nota em `11 Investigations` (`tags: consumidor/event-storming`)
ou marque `[⚠️ Pendente: [[Investigação - …]]]`.

## Fronteira com o DDD

O Event Storming **descobre** a linha do tempo, as fatias e os contextos
**candidatos**; o DDD **modela** (agregados/entidades/objetos de valor, linguagem
ubíqua por contexto, mapa de contextos com ACL/OHS). Os eventos-pivô de
`boundaries.md` são insumo para o `bounded-contexts.md` do DDD, que os refina.

## Regras

- Lê só o substrato (vault); escreve só em `docs/event-storming/`.
- Todo bloco factual cita a evidência por wikilink — `[[EV-… · resumo|EV-…]]` — ou marca
  `[⚠️ Pendente: [[Investigação - …]]]`.
- Fidelidade a Alberto Brandolini — templates fixos, sem inventar campos.
- Nada de vocabulário exclusivo da Lean Inception ou do DDD; o vocabulário
  compartilhado com o DDD é permitido.
