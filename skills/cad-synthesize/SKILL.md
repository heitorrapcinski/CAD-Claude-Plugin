---
name: cad-synthesize
description: Orquestrador /cad:synthesize (técnica + escopo) — roda um módulo de técnica (lean-inception | ddd), lendo só o substrato neutro (docs/cad/) e escrevendo só os artefatos na pasta da própria técnica. Marca lacunas de síntese no backlog com consumidor da técnica.
argument-hint: "<técnica> [escopo]  (ex.: lean-inception | ddd subdomains)"
---

# /cad:synthesize — Síntese por módulo de técnica

## Objetivo

Executar um **módulo de técnica** sobre o substrato neutro: carregar o contrato
da técnica, validar que o substrato tem o mínimo necessário, e invocar os
doc-skills do módulo — que **leem só de `docs/cad/`** e **escrevem só em
`docs/<técnica>/`**. Lacunas específicas da técnica vão para o backlog marcadas
com `consumidor: <técnica>`.

## Entradas

- **Argumento `<técnica>`** — o **nome programático**: `lean-inception` ou `ddd`.
  Recuse técnicas fora do escopo implementado.
- **Argumento `[escopo]`** (opcional) — restringe a quais artefatos gerar.
- O **`module.json`** do módulo correspondente (`skills/<técnica>-module/module.json`)
  — o contrato enforceável (campos `tecnica`, `metodo_de_origem`, `pasta_saida`,
  `entradas_substrato`, `artefatos`, `vocabulario_proibido`).
- O substrato neutro em `docs/cad/`.

## Procedimento

1. **Carregar o contrato.** Leia o `module.json` da técnica via `JSON.parse`. Leia
   também o manifesto humano (`<técnica>-module/SKILL.md`) para a intenção do
   método.
2. **Validar o mínimo do substrato.** Confirme que os arquivos em
   `entradas_substrato` existem e têm conteúdo suficiente para os artefatos
   pedidos. Se faltar, **não invente**: aponte exatamente quais itens de backlog
   resolver antes (sugira `/cad:backlog`) ou ofereça sintetizar com lacunas
   explícitas marcadas como `[⚠️ Pendente: BL-XXX]`. A decisão é do consultor
   (seção 7).
3. **Invocar os doc-skills do módulo.** Para cada artefato em `artefatos` (ou no
   `escopo`), chame o `<técnica>-doc-*` correspondente. Cada um:
   - lê **apenas** os arquivos de `entradas_substrato`;
   - escreve **apenas** dentro de `pasta_saida`;
   - herda evidências do substrato — todo bloco factual carrega `[Fonte: EV-XXX]`
     (referenciando o `evidence-log.md` do substrato) ou `[⚠️ Pendente: BL-XXX]`;
   - **não cria evidência nova**; quando falta um fato, abre backlog.
4. **Respeitar o `vocabulario_proibido`.** Nenhum termo de outra técnica pode
   aparecer nos artefatos (o hook de isolamento bloqueia; você deve evitar de
   antemão). Lean não usa "bounded context", "agregado", "linguagem ubíqua"…;
   DDD não usa "MVP", "persona", "jornada (Lean)", "sequenciador", "é-não é"…
5. **Backlog marcado por consumidor.** Lacunas que só importam para esta técnica
   entram via `cad-doc-backlog` com `consumidor: <técnica>` e o artefato afetado.
6. **Proteção de validação humana.** Não sobrescreva blocos de artefato com origem
   "validação humana"; conflito novo abre `conflito_pós_validação`.

## Saída ao final

Atualize `state.json` (append no histórico). Liste os artefatos gerados/atualizados
em `docs/<técnica>/`, as lacunas de síntese abertas (`consumidor: <técnica>`) e um
resumo de cobertura da técnica.

## Regras inegociáveis

- Lê só o substrato; escreve só na própria pasta (princípios 2 e 3).
- Isolamento por técnica — nenhum vazamento de vocabulário entre métodos.
- Rastreabilidade preservada (princípio 11): todo fato vem do substrato.
- Fidelidade ao método de origem (princípio 10): templates fixos das seções 8.2/8.3.
