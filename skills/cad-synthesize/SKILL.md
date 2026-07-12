---
name: cad-synthesize
description: Orquestrador /cad:synthesize (técnica + escopo) — roda um módulo de técnica descoberto dinamicamente pelo seu module.json (lean-inception | ddd | event-storming), lendo só o substrato neutro (Knowledge Vault em docs/knowledge-vault/) e escrevendo só os artefatos na pasta da própria técnica. Marca lacunas de síntese como investigações com consumidor da técnica.
argument-hint: "<técnica> [escopo]  (ex.: ddd | event-storming timeline)"
---

# /cad:synthesize — Síntese por módulo de técnica

## Objetivo

Executar um **módulo de técnica** sobre o substrato neutro (o **Knowledge Vault** em
`docs/knowledge-vault/`): carregar o contrato da técnica, validar que o substrato tem o mínimo
necessário, e invocar os doc-skills do módulo — que **leem só de `docs/knowledge-vault/`** e
**escrevem só em `docs/<técnica>/`**. Lacunas específicas da técnica viram notas em
`11 Investigations` marcadas com `tags: consumidor/<técnica>`.

## Entradas

- **Argumento `<técnica>`** — o **nome programático** de qualquer módulo instalado.
  As técnicas **não são uma lista fixa no código**: são **descobertas
  dinamicamente** pela varredura de `skills/*-module/module.json` (o helper
  `loadAllContracts` faz esse glob). Aceite a técnica cujo campo `tecnica` do
  contrato bate com o argumento; recuse (listando as disponíveis) se nenhuma bater.
  Hoje os módulos plugados são `lean-inception`, `ddd` e `event-storming`, mas um
  módulo novo passa a valer só por existir seu `module.json` — sem tocar neste
  orquestrador.
- **Argumento `[escopo]`** (opcional) — restringe a quais artefatos gerar.
- O **`module.json`** do módulo correspondente (`skills/<técnica>-module/module.json`)
  — o contrato enforceável (campos `tecnica`, `metodo_de_origem`, `pasta_saida`,
  `entradas_substrato`, `artefatos`, `vocabulario_proibido`).
- O substrato neutro em `docs/knowledge-vault/` e `.cad-plugin/state.json` (sessão/histórico).

## Procedimento

1. **Descobrir e carregar o contrato.** Varra `skills/*-module/module.json`
   (descoberta dinâmica, sem lista fixa), selecione o contrato cujo `tecnica` bate
   com o argumento e leia-o via `JSON.parse`. Leia também o manifesto humano
   (`<técnica>-module/SKILL.md`) para a intenção do método.
2. **Validar o mínimo do substrato.** Confirme que as **pastas do vault** listadas em
   `entradas_substrato` existem e contêm notas suficientes para os artefatos pedidos. Se
   faltar, **não invente**: aponte exatamente quais investigações abertas
   (`11 Investigations`) resolver antes (sugira `/cad:backlog`), ou que a
   `/cad:discovery` ainda precisa cobrir aquela área — ou ofereça sintetizar com lacunas
   explícitas marcadas como `[⚠️ Pendente: [[Investigação - …]]]`. A decisão é do consultor.
3. **Invocar os doc-skills do módulo.** Para cada artefato em `artefatos` (ou no
   `escopo`), chame o `<técnica>-doc-*` correspondente. Cada um:
   - lê **apenas** as pastas de `entradas_substrato` (o vault);
   - escreve **apenas** dentro de `pasta_saida`;
   - herda a rastreabilidade do substrato — todo bloco factual cita a evidência por
     `[[EV-… · resumo|EV-…]]` (nota de `09 Evidence`) ou marca
     `[⚠️ Pendente: [[Investigação - …]]]`;
   - **não cria evidência nova** e **nunca lê a fonte nem escreve o substrato**. Quando um
     fato necessário **não está no vault**, abre uma nota em `11 Investigations`
     (`tags: consumidor/<técnica>`). Ampliar o vault é papel exclusivo da `/cad:discovery`.
4. **Respeitar o `vocabulario_proibido`.** Nenhum termo de outra técnica pode
   aparecer nos artefatos (o hook de isolamento bloqueia; você deve evitar de
   antemão). Lean não usa "bounded context", "agregado", "linguagem ubíqua"…;
   DDD não usa "MVP", "persona", "jornada (Lean)", "sequenciador", "é-não é"…
5. **Lacunas marcadas por consumidor.** Lacunas que só importam para esta técnica viram
   notas em `11 Investigations` (via `knowledge-vault-doc-investigations`) com
   `tags: consumidor/<técnica>` e link para o artefato afetado.
6. **Proteção de validação humana.** Não sobrescreva blocos/notas com origem "validação
   humana"; conflito novo abre investigação `conflito_pós_validação`.

## Saída ao final

Atualize `state.json` (append no histórico). Liste os artefatos gerados/atualizados em
`docs/<técnica>/`, as lacunas de síntese abertas (`consumidor/<técnica>` em
`11 Investigations`) e um resumo de cobertura da técnica.

## Regras inegociáveis

- Lê só o substrato (vault); escreve só na própria pasta.
- Isolamento por técnica — nenhum vazamento de vocabulário entre métodos.
- Rastreabilidade preservada: todo fato vem do substrato e cita `[[EV-…]]`.
- Fidelidade ao método de origem: templates fixos, sem inventar campos.
- **A síntese nunca lê a fonte nem escreve o substrato.** Se falta um fato no vault, abre
  investigação (`consumidor/<técnica>`); ampliar o vault é só da `/cad:discovery`. Só a
  **descoberta** escreve o substrato; o módulo, nunca.
