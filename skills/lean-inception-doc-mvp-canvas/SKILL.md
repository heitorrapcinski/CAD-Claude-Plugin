---
name: lean-inception-doc-mvp-canvas
description: Gera docs/lean-inception/mvp-canvas.md — Canvas MVP com os 7 blocos na ordem de Caroli (proposta, personas segmentadas, jornadas, funcionalidades, resultado esperado, métricas, custo/cronograma). No máximo três canvas, um por MVP. Lê só o substrato CAD. Fiel a Caroli.
---

# lean-inception-doc-mvp-canvas — Canvas MVP

## Objetivo

Consolidar o escopo de cada **MVP** no **Canvas MVP** de Caroli, com os **7 blocos
na ordem do livro**. É o artefato de fechamento da Lean Inception.

## Entradas

Lê **apenas** o substrato CAD (`evidence-log.md`) e os artefatos deste módulo
(`objectives.md`, `personas.md`, `journeys.md`, `sequencer.md`). Escreve apenas em
`docs/lean-inception/`. Exige objetivos, personas, jornadas e sequenciador já
preenchidos; faltando, aponte o backlog antes de gerar.

## Template (copiar fielmente)

```markdown
# Canvas MVP — [Nome do MVP]

1. **Proposta do MVP** — Qual é a proposta deste MVP? [Fonte: EV-XXX]
2. **Personas segmentadas** — Para quem é? Dá para testar num grupo menor? [Fonte: EV-XXX]
3. **Jornadas** — Quais jornadas são atendidas/melhoradas? (→ journeys.md)
4. **Funcionalidades** — O que vamos construir / que ações serão melhoradas? (→ sequencer.md)
5. **Resultado esperado** — Que aprendizado/resultado buscamos? [Fonte: EV-XXX | ⚠️ Pendente: BL-XXX]
6. **Métricas para validar as hipóteses do negócio** — Como medir os resultados? [Fonte: EV-XXX | ⚠️ Pendente: BL-XXX]
7. **Custo e Cronograma** — Custo e data prevista para a entrega? [Fonte: EV-XXX | ⚠️ Pendente: BL-XXX]
```

## Como preencher

- Mantenha os **7 blocos na ordem** acima — não reordene nem omita.
- **Faça no máximo três canvas MVP** (um por MVP do sequenciador) e só preencha os
  dos **primeiros** MVPs — fiel à recomendação de Caroli de não ir longe demais.
- Blocos 3 e 4 referenciam `journeys.md` e `sequencer.md`; os blocos factuais
  carregam `[Fonte: EV-XXX]` e o que falta vira `[⚠️ Pendente: BL-XXX]`
  (consumidor: `lean-inception`).
- Resultado esperado, métricas e custo/cronograma costumam exigir validação humana
  — se não houver evidência, **deixe a pendência explícita** (princípios 1 e 11).
- **Vocabulário proibido:** nada de termos de DDD.
