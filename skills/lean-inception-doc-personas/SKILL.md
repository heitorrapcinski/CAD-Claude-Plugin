---
name: lean-inception-doc-personas
description: Gera docs/lean-inception/personas.md — personas no template de Caroli (Apelido, Perfil, Comportamento, Necessidades) com mapa de empatia opcional, lendo só o substrato CAD. Fiel a Caroli.
---

# lean-inception-doc-personas — Personas

## Objetivo

Descrever as **personas** do produto no template de Caroli, com um **mapa de
empatia** opcional. Responde "para quem estamos construindo".

## Entradas

Lê **apenas** o substrato CAD (`knowledge-base.md`, `vocabulary.md`,
`capabilities.md`, `evidence-log.md`). Escreve apenas em `docs/lean-inception/`.

## Template (copiar fielmente)

```markdown
# Personas — [Nome do Produto]

## Persona: [Apelido] [Fonte: EV-XXX]
- **Perfil:** [idade, papel/ocupação, formação, contexto] [Fonte: EV-XXX]
- **Comportamento:** [traços comportamentais] [Fonte: EV-XXX]
- **Necessidades:** [necessidades específicas] [Fonte: EV-XXX | ⚠️ Pendente: BL-XXX]

### Mapa de empatia (opcional)
- **Vejo:** [...] · **Ouço:** [...] · **Penso/Sinto:** [...] · **Falo/Faço:** [...]
- **Dores:** [...] · **Ganhos:** [...]
```

## Como preencher

- Uma seção `## Persona:` por persona, com **Apelido** memorável.
- **Perfil** (substantivos/contexto), **Comportamento** (traços) e **Necessidades**
  (específicas) — cada um lastreado em `[Fonte: EV-XXX]`; o que faltar vira
  `[⚠️ Pendente: BL-XXX]` (consumidor: `lean-inception`).
- O **mapa de empatia** é **opcional**; só inclua os quadrantes com evidência.
- Persona é construída a partir de fatos do substrato sobre usuários — **não
  invente** perfis verossímeis sem fonte.
- **Vocabulário proibido:** nada de termos de DDD.
