---
name: lean-inception-doc-personas
description: Gera docs/lean-inception/personas.md — personas no template de Caroli (Apelido, Perfil, Comportamento, Necessidades) com mapa de empatia opcional, lendo só o substrato CAD. Fiel a Caroli.
---

# lean-inception-doc-personas — Personas

## Objetivo

Descrever as **personas** do produto no template de Caroli, com um **mapa de
empatia** opcional. Responde "para quem estamos construindo".

## Entradas

Lê **apenas** o substrato CAD (Knowledge Vault): `01 Overview/` (stakeholders/usuários),
`02 Business Knowledge/` (papéis, capacidades) e as notas de **evidência** (`09 Evidence/`).
Escreve apenas em `docs/lean-inception/`.

## Template (copiar fielmente)

```markdown
# Personas — [Nome do Produto]

## Persona: [Apelido] [[EV-… · resumo|EV-…]]
- **Perfil:** [idade, papel/ocupação, formação, contexto] [[EV-… · resumo|EV-…]]
- **Comportamento:** [traços comportamentais] [[EV-… · resumo|EV-…]]
- **Necessidades:** [necessidades específicas] [[EV-… · resumo|EV-…]] | [⚠️ Pendente: [[Investigação - …]]]

### Mapa de empatia (opcional)
- **Vejo:** [...] · **Ouço:** [...] · **Penso/Sinto:** [...] · **Falo/Faço:** [...]
- **Dores:** [...] · **Ganhos:** [...]
```

## Como preencher

- Uma seção `## Persona:` por persona, com **Apelido** memorável.
- **Perfil** (substantivos/contexto), **Comportamento** (traços) e **Necessidades**
  (específicas) — cada um lastreado em `[[EV-… · resumo|EV-…]]`; o que faltar vira
  `[⚠️ Pendente: [[Investigação - …]]]` (consumidor: `lean-inception`).
- O **mapa de empatia** é **opcional**; só inclua os quadrantes com evidência.
- Persona é construída a partir de fatos do substrato sobre usuários — **não
  invente** perfis verossímeis sem fonte.
- **Vocabulário proibido:** nada de termos de DDD.
