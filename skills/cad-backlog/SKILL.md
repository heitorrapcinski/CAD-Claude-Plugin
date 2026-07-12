---
name: cad-backlog
description: Orquestrador /cad:backlog [nota...] — apresenta as investigações abertas (11 Investigations) em formulário ao consultor, grava a resposta como evidência "Validação Humana" (a mais forte de todas) e propaga a atualização às notas afetadas, no substrato (docs/knowledge-vault/) ou no módulo da técnica indicada.
argument-hint: "[nota...]  (ex.: \"Alçadas de Aprovação\"; sem argumento lista todas as abertas)"
---

# /cad:backlog — Resolução de investigações por validação humana

## Objetivo

Transformar as **investigações** abertas (`11 Investigations`) em **evidência de validação
humana** — a fonte mais forte da hierarquia, pois é julgamento informado do especialista
sobre o caso concreto. Resolve lacunas e conflitos, registra a resposta como uma nota de
evidência e propaga a atualização às notas afetadas.

O antigo `backlog.md` foi substituído pela pasta `11 Investigations`; este comando opera
sobre essas notas.

## Entradas

- **Argumento `[nota...]`** (opcional) — títulos/aliases de investigações específicas. Sem
  argumento, lista **todas** as investigações abertas (`status: open`/`conflicting`).
- `docs/knowledge-vault/11 Investigations/` — as notas de pendência (via
  [`knowledge-vault-doc-investigations`](../knowledge-vault-doc-investigations/SKILL.md)).
- As notas afetadas (linkadas em **Afeta**), no substrato (`docs/knowledge-vault/`) ou no módulo da
  técnica (indicado pela tag `consumidor/<técnica>`).

## Procedimento

1. **Listar investigações.** Via `knowledge-vault-doc-investigations`, liste as notas abertas,
   filtradas pelos títulos quando informados. Para cada uma mostre o tipo (lacuna,
   `conflito_definição`, `conflito_pós_validação`…), o consumidor (tag) e as notas
   afetadas. Em conflito, apresente a versão priorizada (por hierarquia) **e** todas as
   evidências divergentes.
2. **Formulário ao consultor.** Para cada investigação, faça uma pergunta clara e objetiva.
   Aguarde a resposta — **não preencha por conta própria** (é o espírito do CAD).
3. **Gravar a resposta como evidência.** Sinalize o fluxo com `CAD_BACKLOG_FLOW=1` e, via
   [`knowledge-vault-doc-evidence`](../knowledge-vault-doc-evidence/SKILL.md), crie uma nota de evidência `EV-NNN`
   em `09 Evidence` com `type: evidence`, `status: validated` e
   `source: "validação humana (consultor) — <data>"`. Esta evidência **supera a hierarquia
   normativa** para o ponto em questão.
4. **Propagar às notas afetadas.** Atualize as notas citadas em **Afeta** — no substrato ou
   no módulo da técnica. Aponte o `source:` delas para a nova evidência de validação e mude
   seu `status` para `validated`. O bloco/nota validado passa a ser **protegido**.
5. **Resolver a investigação.** Na nota de `11 Investigations`, preencha a seção
   **Resolução**, mude `status` para `validated` e ligue-a à evidência criada. Quando a
   resolução vira conclusão, considere promover a uma nota em `10 Decisions` (hipótese
   confirmada).

## Observações

- **Único canal de sobrescrita de nota validada.** Os hooks bloqueiam alterar uma nota de
  origem "validação humana" fora deste fluxo (`CAD_BACKLOG_FLOW=1`). Aqui, e só aqui, ela é
  permitida — inclusive para resolver `conflito_pós_validação`.
- Não há comando separado de glossário ou cobertura: conflito de definição é uma
  investigação; cobertura é saída de discovery/synthesize.

## Regras inegociáveis

- Validação humana é a evidência mais forte.
- Toda resolução vira uma nota de evidência rastreável (`09 Evidence`).
- Evidências são imutáveis: a validação cria nota **nova**, nunca reescreve histórico.
