---
name: cad-backlog
description: Orquestrador /cad:backlog [id...] — apresenta pendências (lacunas e conflitos) em formulário ao consultor, grava a resposta como evidência "Validação Humana" (a mais forte de todas) e atualiza os documentos afetados, no substrato ou no módulo da técnica indicada.
argument-hint: "[id...]  (ex.: BL-003 BL-007; sem argumento lista todas as abertas)"
---

# /cad:backlog — Resolução de pendências por validação humana

## Objetivo

Transformar pendências do backlog em **evidência de validação humana** — a fonte
mais forte da hierarquia (princípio 5), pois é julgamento informado do especialista
sobre o caso concreto. Resolve lacunas e conflitos, registra a resposta como
evidência e propaga a atualização aos documentos afetados.

## Entradas

- **Argumento `[id...]`** (opcional) — lista de IDs (`BL-003 BL-007`). Sem
  argumento, lista **todas** as pendências abertas.
- `docs/cad/backlog.md` — a fila de pendências (via `cad-doc-backlog`).
- O documento afetado de cada item (coluna `Artefato afetado`), no substrato
  (`docs/cad/`) ou no módulo da técnica (coluna `Consumidor`).

## Procedimento

1. **Listar pendências.** Invoque `cad-doc-backlog` para listar os itens abertos,
   filtrados pelos IDs quando informados. Mostre tipo, consumidor, lacuna/conflito
   e artefato afetado de cada um. Para `conflito_definição`, apresente a definição
   priorizada (por hierarquia) **e** todos os conflitos detectados.
2. **Formulário ao consultor.** Para cada item, faça uma pergunta clara e objetiva.
   Aguarde a resposta — **não preencha por conta própria** (é o espírito do CAD).
3. **Gravar a resposta como evidência.** Via `cad-doc-evidence-log`, crie uma
   entrada `EV-NNN` com tipo de fonte **`Validação Humana`** e fonte
   `"validação consultor — [data]"`. Esta evidência **supera a hierarquia
   normativa** para o ponto em questão.
4. **Atualizar o(s) documento(s) afetado(s).** Propague a resolução para o artefato
   citado — no substrato (`knowledge-base`, `vocabulary`, `business-rules`,
   `capabilities`) ou no módulo da técnica (`docs/<técnica>/...`). Substitua o
   marcador `[⚠️ Pendente: BL-XXX]` pelo conteúdo confirmado com `[Fonte: EV-NNN]`.
   Marque o bloco como de **origem validação humana** (passa a ser protegido).
5. **Fechar o item.** Em `backlog.md`, mude `Status` para resolvido, preenchendo
   `Resposta`, `Fonte resposta` e `Data`.

## Observações

- **Único canal de sobrescrita de bloco validado.** Os hooks bloqueiam alterar um
  bloco de origem "validação humana" fora deste fluxo. Aqui, e só aqui, ela é
  permitida — inclusive para resolver `conflito_pós_validação`.
- Não há comando separado de glossário ou cobertura: conflito de definição é um
  tipo de item de backlog; cobertura é saída de discovery/synthesize.

## Regras inegociáveis

- Validação humana é a evidência mais forte (princípio 5).
- Toda resolução vira evidência rastreável (princípio 1 e 11).
- Apêndice no `evidence-log`, nunca sobrescrita do histórico de evidências.
