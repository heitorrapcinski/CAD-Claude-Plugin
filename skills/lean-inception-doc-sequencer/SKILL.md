---
name: lean-inception-doc-sequencer
description: Gera docs/lean-inception/sequencer.md — sequenciador de funcionalidades em ondas (com as 6 regras de Caroli) e a estimativa de esforço/tempo/custo por amostragem de ondas, demarcando os MVPs. Lê só o substrato CAD. Fiel a Caroli.
---

# lean-inception-doc-sequencer — Sequenciador

## Objetivo

Ordenar as funcionalidades em **ondas** de entrega, respeitando as **6 regras de
Caroli**, demarcando os **MVPs**, e estimar **esforço/tempo/custo** por amostragem
de ondas. Substitui qualquer priorização por MoSCoW (que **não** é da Lean).

## Entradas

Lê **apenas** o substrato CAD (Knowledge Vault): as notas de **evidência**
(`09 Evidence/`) e os artefatos deste módulo (`features.md` com as marcações de
Confiança/E/$/♥, `journeys.md`). Escreve apenas em `docs/lean-inception/`.

## Template (copiar fielmente)

```markdown
# Sequenciador de Funcionalidades — [Nome]

> Regras de Caroli para cada onda:
> 1) máx. 3 cartões · 2) máx. 1 vermelho · 3) não 3 só amarelos/vermelhos
> 4) Σ esforço ≤ 5E · 5) Σ valor ≥ 4$ e 4♥ · 6) dependência sempre em onda anterior.

| Onda | Funcionalidades (≤3) | Σ Esforço | Σ $ | Σ ♥ | MVP |
|---|---|---|---|---|---|
| 1 | F1, F2, F3 | 4E | $$$$ | ♥♥♥♥♥ | MVP1 |
| 2 | F4, F5 | 3E | $$$$$ | ♥♥♥♥ | MVP1 |
| 3 | F6, F7, F8 | 5E | $$$$ | ♥♥♥♥ | MVP2 |

## Esforço, tempo e custo (por amostragem de ondas)
- **Ondas amostradas:** [ex.: 1 e 3]
- **Tarefas detalhadas / tamanho médio de onda:** [...]
- **Estimativa MVP1:** [tempo/custo] [[EV-… · resumo|EV-…]] | [⚠️ Pendente: [[Investigação - …]]]
```

## Como preencher

- Aplique as **6 regras** a cada onda, derivando E/$/♥ das marcações de
  `features.md`:
  1. máx. **3** cartões; 2. máx. **1** vermelho; 3. não **3** só amarelos/vermelhos;
  4. Σ esforço **≤ 5E**; 5. Σ valor **≥ 4$ e 4♥**; 6. dependência **sempre em onda
  anterior**.
- Demarque os **MVPs** na última coluna; um MVP agrupa ondas.
- A estimativa de esforço/tempo/custo é feita **por amostragem** de ondas (detalha
  uma ou duas, extrapola), com `[[EV-… · resumo|EV-…]]` ou `[⚠️ Pendente: [[Investigação - …]]]`.
- Não estime custo/prazo sem evidência — marque pendência (consumidor:
  `lean-inception`).
- **Vocabulário proibido:** nada de termos de DDD.
