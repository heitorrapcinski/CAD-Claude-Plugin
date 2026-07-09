---
name: cad-doc-vocabulary
description: Gerencia docs/cad/vocabulary.md — termos do domínio com definição priorizada por hierarquia de fontes e todos os conflitos detectados. Neutro por design — SEM bounded context (isso é recorte do DDD). Invocado por /cad:discovery e /cad:backlog.
---

# cad-doc-vocabulary — Vocabulário do Domínio (substrato neutro)

## Objetivo

Registrar **termos do domínio** com a definição priorizada (pela hierarquia de
fontes) e **todos** os conflitos detectados entre fontes. É a ponte para a
linguagem ubíqua por contexto do DDD — mas aqui é **neutro**: sem *bounded
context*, que é um recorte do DDD e vive em `docs/ddd/ubiquitous-language.md`.

## Entradas

- Fontes escaneadas por `/cad:discovery`.
- `docs/cad/evidence-log.md` — cada definição e cada conflito cita uma `EV-XXX`.

## Template (copiar fielmente)

```markdown
# Vocabulário — Termos do Domínio

## Termo: "Aprovação"
- **Definição priorizada (normativo):** [definição] → EV-014
- **NÃO confundir com:** [termo parecido, e por quê]
- **Conflitos detectados:**
  - Código (EV-015): trata como etapa única ⚠️
  - Doc corporativa (EV-022): descreve 3 etapas ⚠️
- **Status:** conflito aberto | resolvido por humano
- **Resolução humana:** [se houver] → fonte: "validação consultor — 2026-06-25"
```

## Como preencher

- A **definição priorizada** segue a hierarquia: Normativo > Corporativo > Código
  > Informal. Indique entre parênteses de qual nível ela veio.
- **Liste todos os conflitos** com sua evidência e o sinal ⚠️ — divergências
  nunca são escondidas.
- `Status`: `conflito aberto` (abra item `conflito_definição` em
  `cad-doc-backlog`) ou `resolvido por humano` (após `/cad:backlog`).
- **Não inclua `Contexto (bounded context)`** — esse campo foi removido daqui; é do
  módulo DDD. Manter aqui violaria o isolamento por técnica.
- Bloco resolvido por humano é protegido; só `/cad:backlog` altera.
