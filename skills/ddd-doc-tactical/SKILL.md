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
`data-structures.md` (→ entidades, objetos de valor, atributos e relações),
`knowledge-base.md`, `vocabulary.md` e `evidence-log.md`. Usa os contextos de
`bounded-contexts.md` (deste módulo). Escreve apenas em `docs/ddd/`. Exige
`business-rules.md` e `bounded-contexts.md` já preenchidos.

**Fonte primária dos atributos: `data-structures.md`.** Campos, valores enumerados,
exemplos/formatos e relações (multiplicidade) vêm daí como **fato neutro** já
citando `EV-XXX`. O DDD **interpreta** essas estruturas — decide o que é entidade,
objeto de valor e a raiz do agregado — mas **não descobre** os campos. Só quando
`data-structures.md` não cobre um detalhe é que entra o **aprofundamento sob demanda**
(seção 5.1), como rede de segurança.

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
> escopo do módulo **Event Storming** (seção 8.4), não deste — evitando sobreposição.

> **Detalhe de atributo vem do aprofundamento sob demanda (seção 5.1).** Os campos de
> uma entidade/objeto de valor (ex.: os atributos de `Proposta`) raramente estão no
> substrato grosso. Quando faltam, a síntese relê — via descoberta — a fonte **já
> autorizada** apontada por um `EV` (ex.: `credito/service.py`), grava os campos como
> fato neutro novo (ex.: `EV-090`), e este template os cita. O julgamento "isto é um
> objeto de valor" continua sendo do DDD; a lista de campos é fato descritivo do
> substrato.
```

## Como preencher

- Um arquivo/`# Agregados — Contexto [Nome]` por bounded context; uma seção
  `## Agregado:` por agregado, sempre com a **raiz**.
- **Invariantes** referenciam `business-rules.md#BR-XXX` (a ponte do substrato) e
  citam `EV-XXX`.
- **Eventos de domínio** aqui são os do **modelo tático** (publicados por um
  agregado). **Não** modele a descoberta de eventos em filas/APIs/processos — isso
  é **Event Storming** (seção 8.4), fora deste escopo, para evitar sobreposição.
- **Atributos (campos), exemplos e relações vêm primeiro de `data-structures.md`.**
  Consuma daí os campos, valores enumerados, exemplos/formatos e a multiplicidade das
  relações — já são fato neutro com `EV`. O DDD apenas **classifica** (isto é entidade,
  isto é objeto de valor, esta é a raiz) e desenha a fronteira do agregado; o campo em
  si é **fato descritivo** do substrato. A "Nota de fronteira" de cada estrutura lembra
  que o agrupamento observado no código **não** é o veredito de fronteira — quem decide
  é aqui.
- **Aprofundamento sob demanda é a rede, não a fonte primária (seção 5.1).** Só quando
  `data-structures.md` **não cobre** um detalhe: **não infira em silêncio nem leia a
  fonte** aqui — sinalize a lacuna com o **ponteiro de `EV`** que aponta ao código (ex.:
  `EV-015 → src/Ticket.php`) para o orquestrador aprofundar. Se a fonte já está
  autorizada e `pode_aprofundar = "fontes-autorizadas"`, a descoberta relê o trecho e
  grava o detalhe como fato neutro novo (ex.: `EV-090`); então cite esse `EV`. Fonte
  nova, ou caminho autorizado que não resolve no workspace → `[⚠️ Pendente: BL-XXX]`
  (consumidor: `ddd`), nunca inferência silenciosa.
- Fronteira/modelagem incerta → `Incerteza de modelagem: [⚠️ Pendente: BL-XXX]`
  (consumidor: `ddd`); nada de inferência silenciosa.
- **Vocabulário proibido:** nada de termos exclusivos da Lean (`MVP`, `persona`,
  `jornada` sentido Lean, `onda`/`sequenciador`, `é-não é-faz-não faz`) nem do Event
  Storming (`hotspot`, `evento-pivô`). O vocabulário compartilhado com o ES
  (`aggregate`, `domain event`, `command`, `policy`, `read model`, `bounded context`)
  é permitido.
