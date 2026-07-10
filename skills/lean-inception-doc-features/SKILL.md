---
name: lean-inception-doc-features
description: Gera docs/lean-inception/features.md — funcionalidades por brainstorming (Objetivos × Personas) e revisão pelo gráfico do semáforo (🟢🟡🔴) com tabela Esforço/Negócio/UX (E/$/♥), rastreadas à jornada de origem. Lê só o substrato CAD. Fiel a Caroli.
---

# lean-inception-doc-features — Funcionalidades

## Objetivo

Levantar **funcionalidades** por brainstorming guiado por **Objetivos (colunas) ×
Personas (linhas)** e revisá-las por **confiança** (gráfico do semáforo) e pelas
marcações de **Esforço / Negócio / UX**.

## Entradas

Lê **apenas** o substrato CAD (Knowledge Vault): `02 Business Knowledge/` (capacidades e
regras), `04 Behavioral Knowledge/` (fluxos/casos de uso) e as notas de **evidência**
(`09 Evidence/`); e os artefatos já gerados deste mesmo módulo (`objectives.md`,
`personas.md`) para as colunas/linhas. Escreve apenas em `docs/lean-inception/`.

## Template (copiar fielmente)

```markdown
# Funcionalidades — [Nome]

> Brainstorming guiado por Objetivos (colunas) × Personas (linhas).
> Revisão: Confiança pelo gráfico do semáforo (🟢 alto / 🟡 médio / 🔴 baixo,
> combinando confiança técnica "como fazer" × confiança negócio/UX "o que fazer").
> Marcações: Esforço E/EE/EEE · Negócio $/$$/$$$ · UX ♥/♥♥/♥♥♥.

| Funcionalidade | Persona | Objetivo | Confiança | Esforço | Negócio | UX | Jornada de origem |
|---|---|---|---|---|---|---|---|
| [func] [[EV-… · resumo|EV-…]] | [apelido] | [objetivo] | 🟢/🟡/🔴 | EE | $$ | ♥♥♥ | Jornada: [nome] |

> Funcionalidade 🔴 marcada com "X" (baixa confiança técnica E de negócio/UX):
> descartar ou esclarecer antes de prosseguir. Funcionalidade sem persona
> associada: descartar ou repensar.
```

## Como preencher

- Cada funcionalidade carrega `[[EV-… · resumo|EV-…]]`; sem evidência,
  `[⚠️ Pendente: [[Investigação - …]]]` (consumidor: `lean-inception`).
- **Confiança** pelo semáforo: 🟢 alto, 🟡 médio, 🔴 baixo — combinando confiança
  **técnica** ("como fazer") × **negócio/UX** ("o que fazer").
- Marcações: **Esforço** `E/EE/EEE`, **Negócio** `$/$$/$$$`, **UX** `♥/♥♥/♥♥♥`.
- Toda funcionalidade liga-se a uma **Persona** e a um **Objetivo**; e registra a
  **Jornada de origem** (ponte para `journeys.md` e `sequencer.md`).
- Funcionalidade **🔴** (baixa confiança técnica **e** de negócio/UX): marque "X" —
  descartar ou esclarecer antes de seguir. **Sem persona** associada: descartar ou
  repensar.
- **Vocabulário proibido:** nada de termos de DDD.
