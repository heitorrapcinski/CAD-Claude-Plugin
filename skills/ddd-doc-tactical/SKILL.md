---
name: ddd-doc-tactical
description: Gera docs/ddd/aggregates.md — blocos táticos por contexto (agregados, entidades, objetos de valor, invariantes consumindo as regras de negócio do vault, eventos de domínio e repositórios). Lê só o substrato CAD. Fiel a Eric Evans.
---

# ddd-doc-tactical — DDD Tático (Agregados)

## Objetivo

Modelar os **blocos táticos** por bounded context: **agregados** (com raiz),
**entidades**, **objetos de valor**, **invariantes** (consumindo as **regras de
negócio** do vault), **eventos de domínio** publicados e **repositórios**.

## Entradas

Lê **apenas** o substrato CAD (Knowledge Vault): as **regras de negócio**
(`02 Business Knowledge/` → invariantes), as **entidades/conceitos** e **tabelas com
campos** (`03 Structural Knowledge/` e `06 Data/` → entidades, objetos de valor,
atributos e relações) e as notas de **evidência** (`09 Evidence/`). Usa os contextos de
`bounded-contexts.md` (deste módulo). Escreve apenas em `docs/ddd/`. Exige regras de
negócio e `bounded-contexts.md` já preenchidos.

**Fonte primária dos atributos: `03 Structural Knowledge/` e `06 Data/`.** Campos,
valores enumerados, exemplos/formatos e relações (multiplicidade) vêm dessas notas como
**fato neutro** já ligado a uma `[[EV-…]]`. O DDD **interpreta** essas estruturas — decide
o que é entidade, objeto de valor e a raiz do agregado — mas **não descobre** os campos.
Se um detalhe não está no vault, **não infira**: abre-se `11 Investigations`
(`consumidor/ddd`); ampliar o vault é papel da `/cad:discovery`.

## Template (copiar fielmente)

```markdown
# Agregados — Contexto [Nome]

## Agregado: [Raiz do Agregado]
- **Raiz (entidade):** [ex.: Proposta] [[EV-5-a3-040 · Classe Proposta|EV-5-a3-040]]
- **Entidades:** [ex.: ItemDaProposta] [[EV-5-a3-041 · ItemDaProposta|EV-5-a3-041]]
- **Objetos de valor:** [ex.: Valor, CPF, Período] [[EV-5-a6-010 · Campos de Proposta|EV-5-a6-010]]
- **Invariantes (regras que o agregado protege):** [ex.: total = soma dos itens]
  ([[Regra - Total da proposta]]) [[EV-5-a2-012 · Total é soma dos itens|EV-5-a2-012]]
- **Eventos de domínio publicados:** [ex.: PropostaAprovada, PropostaRecusada] [[EV-5-a4-050 · Eventos de Proposta|EV-5-a4-050]]
- **Repositório:** [ex.: PropostaRepository] [[EV-5-a5-020 · PropostaRepository|EV-5-a5-020]]
- **Incerteza de modelagem:** [⚠️ Pendente: [[Investigação - Fronteira do agregado Proposta]]]

> Eventos de domínio aqui são os do **modelo tático** (publicados por um agregado).
> A linha do tempo de processo/descoberta de eventos candidatos em filas e APIs é
> escopo do módulo **Event Storming**, não deste — evitando sobreposição.
```

## Como preencher

- Um arquivo/`# Agregados — Contexto [Nome]` por bounded context; uma seção
  `## Agregado:` por agregado, sempre com a **raiz**.
- **Invariantes** referenciam a nota de regra do substrato por wikilink
  (`[[Regra - Total da proposta]]`) e citam `[[EV-…|EV-…]]`.
- **Eventos de domínio** aqui são os do **modelo tático** (publicados por um
  agregado). **Não** modele a descoberta de eventos em filas/APIs/processos — isso
  é **Event Storming**, fora deste escopo, para evitar sobreposição.
- **Atributos (campos), exemplos e relações vêm de `03 Structural`/`06 Data`.**
  Consuma daí os campos, valores enumerados, exemplos/formatos e a multiplicidade das
  relações — já são fato neutro com `[[EV-…]]`. O DDD apenas **classifica** (isto é
  entidade, isto é objeto de valor, esta é a raiz) e desenha a fronteira do agregado; o
  campo em si é **fato descritivo** do substrato — o agrupamento observado no código
  **não** é o veredito de fronteira, quem decide é aqui.
- **Faltou no vault → investigação, nunca releitura de fonte.** Se `03 Structural`/`06 Data`
  **não cobre** um detalhe (ex.: os campos de uma entidade): **não infira em silêncio nem
  leia a fonte** aqui — abra uma nota em `11 Investigations` (`tags: consumidor/ddd`) e
  marque `[⚠️ Pendente: [[Investigação - …]]]`. Só a `/cad:discovery` amplia o vault.
- Fronteira/modelagem incerta → `Incerteza de modelagem: [⚠️ Pendente: [[Investigação - …]]]`
  (consumidor: `ddd`); nada de inferência silenciosa.
- **Vocabulário proibido:** nada de termos exclusivos da Lean (`MVP`, `persona`,
  `jornada` sentido Lean, `onda`/`sequenciador`, `é-não é-faz-não faz`) nem do Event
  Storming (`hotspot`, `evento-pivô`). O vocabulário compartilhado com o ES
  (`aggregate`, `domain event`, `command`, `policy`, `read model`, `bounded context`)
  é permitido.
