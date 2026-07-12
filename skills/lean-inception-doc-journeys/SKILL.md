---
name: lean-inception-doc-journeys
description: Gera docs/lean-inception/journeys.md — jornadas dos usuários ligando personas a objetivos e às funcionalidades de features.md, com ponto de partida, passos e dores/atritos. Lê só o substrato CAD. Fiel a Caroli.
---

# lean-inception-doc-journeys — Jornadas dos Usuários

## Objetivo

Mapear as **jornadas** que cada persona percorre para atingir um objetivo,
indicando as **funcionalidades** envolvidas (ponte com `features.md`). Responde
"como a persona chega ao objetivo, passo a passo".

## Entradas

Lê **apenas** o substrato CAD (Knowledge Vault): `04 Behavioral Knowledge/` (fluxos e
casos de uso — a fonte primária das jornadas), `02 Business Knowledge/` (regras) e as notas
de **evidência** (`09 Evidence/`); e os artefatos deste módulo (`personas.md`,
`objectives.md`, `features.md`). Escreve apenas em `docs/lean-inception/`.

## Template (copiar fielmente)

```markdown
# Jornadas dos Usuários — [Nome]

## Jornada: [nome] — Persona [apelido] · Objetivo: [...] [[EV-… · resumo|EV-…]]
- **Ponto de partida:** [o que desencadeia o desejo de atingir o objetivo]
- **Passos:** 1. [...] → 2. [...] → 3. [...] → [objetivo alcançado]
- **Funcionalidades nesta jornada:** [F1, F2, …] (→ features.md)
- **Dores/atritos:** [[EV-… · resumo|EV-…]] | [⚠️ Pendente: [[Investigação - …]]]
```

## Como preencher

- Uma seção `## Jornada:` por jornada, nomeando **persona** e **objetivo**.
- **Ponto de partida** é o gatilho do desejo; **Passos** vão até o objetivo
  alcançado.
- **Funcionalidades nesta jornada** referenciam `features.md` (e fecham o ciclo:
  cada feature ali aponta sua "Jornada de origem").
- **Dores/atritos** com evidência; sem fonte, `[⚠️ Pendente: [[Investigação - …]]]` (consumidor:
  `lean-inception`).
- Os passos descrevem o fluxo real evidenciado no substrato — **não** invente
  etapas plausíveis sem fonte.
- **Vocabulário proibido:** nada de termos de DDD (note: "jornada" aqui é no
  sentido **Lean**, não o sentido de outra técnica).
