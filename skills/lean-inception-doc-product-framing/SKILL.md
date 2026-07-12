---
name: lean-inception-doc-product-framing
description: Gera os três artefatos de definição do produto da Lean Inception — vision.md (Visão de Geoffrey Moore), product-enfn.md (É/Não é/Faz/Não faz) e objectives.md (Objetivos + trade-offs) — em docs/lean-inception/, lendo só o substrato CAD. Fiel a Caroli.
---

# lean-inception-doc-product-framing — Definição do Produto

## Objetivo

Produzir as três atividades **de definição do produto** de Caroli, que andam
juntas: a **Visão** (template de Geoffrey Moore), o **É – Não é – Faz – Não faz**
e os **Objetivos do produto**. Responde "que produto é este, para quem e por quê".

## Entradas

Lê **apenas** o substrato CAD (Knowledge Vault): `01 Overview/` (o que é / glossário),
`02 Business Knowledge/` (problema, benefício, objetivos) e as notas de **evidência**
(`09 Evidence/`). Escreve apenas em `docs/lean-inception/`. Cada bloco factual cita a
evidência por `[[EV-… · resumo|EV-…]]`.

## Templates (copiar fielmente)

### `vision.md` — Visão do Produto (template de Geoffrey Moore)

```markdown
# Visão do Produto — [Nome]

Para [cliente final] [[EV-… · resumo|EV-…]]
cujo [problema que precisa ser resolvido] [[EV-… · resumo|EV-…]]
o [nome do produto]
é um [categoria do produto]
que [benefício-chave, razão para adquiri-lo] [[EV-… · resumo|EV-…]]
diferentemente de [alternativa da concorrência]
o nosso produto [diferença-chave] [[EV-… · resumo|EV-…]]

## Lacunas
[⚠️ Pendente: [[Investigação - …]]] — [lacuna para fechar a frase]
```

### `product-enfn.md` — É / Não é / Faz / Não faz

> Dica de Caroli: **É** = substantivo/adjetivo; **Faz** = verbo/ação.

```markdown
# O Produto É – Não é – Faz – Não faz — [Nome]

| É (substantivo/adjetivo) | Não é |
|---|---|
| [característica] [[EV-… · resumo|EV-…]] | [...] [[EV-… · resumo|EV-…]] |

| Faz (verbo/ação) | Não faz |
|---|---|
| [ação] [[EV-… · resumo|EV-…]] | [...] [[EV-… · resumo|EV-…]] |
```

### `objectives.md` — Objetivos do produto (3 principais) + trade-offs (opcional)

```markdown
# Objetivos do Produto — [Nome]

1. [Objetivo de negócio] [[EV-… · resumo|EV-…]]
2. [Objetivo de negócio] [[EV-… · resumo|EV-…]]
3. [Objetivo de negócio] [[EV-… · resumo|EV-…]]

## Trade-offs (opcional)
| Categoria | Nível de importância (1 = menos importante) |
|---|---|
| [ex.: segurança] | [...] |
| [ex.: usabilidade] | [...] |
```

## Como preencher

- Cada linha da Visão e cada célula da tabela carregam `[[EV-… · resumo|EV-…]]`; o que
  não houver evidência vira `[⚠️ Pendente: [[Investigação - …]]]` (consumidor: `lean-inception`)
  — em `vision.md`, liste-as na seção **Lacunas**.
- **É** com substantivos/adjetivos; **Faz** com verbos/ações — respeite a dica.
- Objetivos: prefira **3 principais**, de negócio, derivados do substrato.
- Trade-offs são **opcionais**; só preencha se houver evidência das prioridades.
- **Não** infira para "completar a frase" da Visão; lacuna explícita é melhor que
  invenção.
- **Vocabulário proibido:** nada de `bounded context`, `agregado`, `evento de
  domínio`, `linguagem ubíqua` — são de DDD.
