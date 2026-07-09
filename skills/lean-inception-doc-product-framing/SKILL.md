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

Lê **apenas** o substrato CAD: `knowledge-base.md`, `vocabulary.md`,
`business-rules.md`, `capabilities.md` e `evidence-log.md` (para as `EV-XXX`).
Escreve apenas em `docs/lean-inception/`.

## Templates (copiar fielmente)

### `vision.md` — Visão do Produto (template de Geoffrey Moore)

```markdown
# Visão do Produto — [Nome]

Para [cliente final] [Fonte: EV-XXX]
cujo [problema que precisa ser resolvido] [Fonte: EV-XXX]
o [nome do produto]
é um [categoria do produto]
que [benefício-chave, razão para adquiri-lo] [Fonte: EV-XXX]
diferentemente de [alternativa da concorrência]
o nosso produto [diferença-chave] [Fonte: EV-XXX]

## Lacunas
[⚠️ Pendente: BL-XXX] — [lacuna para fechar a frase]
```

### `product-enfn.md` — É / Não é / Faz / Não faz

> Dica de Caroli: **É** = substantivo/adjetivo; **Faz** = verbo/ação.

```markdown
# O Produto É – Não é – Faz – Não faz — [Nome]

| É (substantivo/adjetivo) | Não é |
|---|---|
| [característica] [Fonte: EV-XXX] | [...] [Fonte: EV-XXX] |

| Faz (verbo/ação) | Não faz |
|---|---|
| [ação] [Fonte: EV-XXX] | [...] [Fonte: EV-XXX] |
```

### `objectives.md` — Objetivos do produto (3 principais) + trade-offs (opcional)

```markdown
# Objetivos do Produto — [Nome]

1. [Objetivo de negócio] [Fonte: EV-XXX]
2. [Objetivo de negócio] [Fonte: EV-XXX]
3. [Objetivo de negócio] [Fonte: EV-XXX]

## Trade-offs (opcional)
| Categoria | Nível de importância (1 = menos importante) |
|---|---|
| [ex.: segurança] | [...] |
| [ex.: usabilidade] | [...] |
```

## Como preencher

- Cada linha da Visão e cada célula da tabela carregam `[Fonte: EV-XXX]`; o que
  não houver evidência vira `[⚠️ Pendente: BL-XXX]` (consumidor: `lean-inception`)
  — em `vision.md`, liste-as na seção **Lacunas**.
- **É** com substantivos/adjetivos; **Faz** com verbos/ações — respeite a dica.
- Objetivos: prefira **3 principais**, de negócio, derivados do substrato.
- Trade-offs são **opcionais**; só preencha se houver evidência das prioridades.
- **Não** infira para "completar a frase" da Visão; lacuna explícita é melhor que
  invenção.
- **Vocabulário proibido:** nada de `bounded context`, `agregado`, `evento de
  domínio`, `linguagem ubíqua` — são de DDD.
