---
name: cad-synthesize
description: Orquestrador /cad:synthesize (técnica + escopo) — roda um módulo de técnica descoberto dinamicamente pelo seu module.json (lean-inception | ddd | event-storming), lendo só o substrato neutro (docs/cad/) e escrevendo só os artefatos na pasta da própria técnica. Suporta aprofundamento sob demanda e a flag --sem-aprofundamento. Marca lacunas de síntese no backlog com consumidor da técnica.
argument-hint: "<técnica> [escopo] [--sem-aprofundamento]  (ex.: ddd | event-storming timeline)"
---

# /cad:synthesize — Síntese por módulo de técnica

## Objetivo

Executar um **módulo de técnica** sobre o substrato neutro: carregar o contrato
da técnica, validar que o substrato tem o mínimo necessário, e invocar os
doc-skills do módulo — que **leem só de `docs/cad/`** e **escrevem só em
`docs/<técnica>/`**. Lacunas específicas da técnica vão para o backlog marcadas
com `consumidor: <técnica>`.

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
- **Flag `--sem-aprofundamento`** (opcional) — força o **modo conservador**: desliga
  o aprofundamento sob demanda neste run (ver seção "Aprofundamento sob demanda").
- O **`module.json`** do módulo correspondente (`skills/<técnica>-module/module.json`)
  — o contrato enforceável (campos `tecnica`, `metodo_de_origem`, `pode_aprofundar`,
  `pasta_saida`, `entradas_substrato`, `artefatos`, `vocabulario_proibido`).
- O substrato neutro em `docs/cad/`; `.cad-plugin/sources.json` (fontes autorizadas)
  e `.cad-plugin/state.json` (sessão/histórico).

## Procedimento

1. **Descobrir e carregar o contrato.** Varra `skills/*-module/module.json`
   (descoberta dinâmica, sem lista fixa), selecione o contrato cujo `tecnica` bate
   com o argumento e leia-o via `JSON.parse`. Leia também o manifesto humano
   (`<técnica>-module/SKILL.md`) para a intenção do método. Anote o campo
   `pode_aprofundar` (`nao` | `fontes-autorizadas`) — ele governa o aprofundamento
   sob demanda.
2. **Validar o mínimo do substrato.** Confirme que os arquivos em
   `entradas_substrato` existem e têm conteúdo suficiente para os artefatos
   pedidos. Se faltar, **não invente**: aponte exatamente quais itens de backlog
   resolver antes (sugira `/cad:backlog`) ou ofereça sintetizar com lacunas
   explícitas marcadas como `[⚠️ Pendente: BL-XXX]`. A decisão é do consultor.
3. **Invocar os doc-skills do módulo.** Para cada artefato em `artefatos` (ou no
   `escopo`), chame o `<técnica>-doc-*` correspondente. Cada um:
   - lê **apenas** os arquivos de `entradas_substrato`;
   - escreve **apenas** dentro de `pasta_saida`;
   - herda evidências do substrato — todo bloco factual carrega `[Fonte: EV-XXX]`
     (referenciando o `evidence-log.md` do substrato) ou `[⚠️ Pendente: BL-XXX]`;
   - **não cria evidência nova**; quando falta um fato, abre backlog **ou** — se for
     lacuna de **detalhe fino** com fonte já autorizada — sinaliza o **ponteiro de
     `EV`** para o aprofundamento sob demanda (próxima seção). O doc-skill **nunca**
     lê a fonte nem escreve o substrato ele mesmo.
4. **Respeitar o `vocabulario_proibido`.** Nenhum termo de outra técnica pode
   aparecer nos artefatos (o hook de isolamento bloqueia; você deve evitar de
   antemão). Lean não usa "bounded context", "agregado", "linguagem ubíqua"…;
   DDD não usa "MVP", "persona", "jornada (Lean)", "sequenciador", "é-não é"…
5. **Backlog marcado por consumidor.** Lacunas que só importam para esta técnica
   entram via `cad-doc-backlog` com `consumidor: <técnica>` e o artefato afetado.
6. **Proteção de validação humana.** Não sobrescreva blocos de artefato com origem
   "validação humana"; conflito novo abre `conflito_pós_validação`.

## Aprofundamento sob demanda (seções 5.1 e 6)

Alguns métodos precisam de **detalhe fino** que o substrato grosso não tem — o caso
canônico é o DDD tático descendo ao nível de **atributos** (campos de uma classe,
colunas de uma tabela). **Regra de ouro: o módulo continua lendo só o substrato;
quem toca a fonte é sempre a descoberta.** Quando um doc-skill de módulo esbarra
numa lacuna de detalhe fino, ele **não** lê a fonte — devolve o **ponteiro de `EV`**
que já existe e você decide:

1. **Fonte já autorizada + caminho resolvido + `pode_aprofundar == "fontes-autorizadas"`.**
   O `EV` apontado (ex.: `EV-015`) carrega, no `evidence-log.md`, a coluna `SRC` que o
   liga a uma fonte **registrada em `sources.json`**. **Resolva o caminho real do trecho
   compondo `sources.json[SRC].caminho` + a `Fonte`/`Localização` do `EV`** (a `Fonte` é
   relativa à `caminho` da SRC — ex.: `caminho` `Extração.../glpi` + `Fonte`
   `src/Ticket.php` = `Extração.../glpi/src/Ticket.php`). Confirme que o arquivo composto
   **existe no workspace**. Havendo permissão de aprofundar, **você** (orquestrador)
   invoca os skills de **descoberta** — `cad-doc-knowledge-base` + `cad-doc-evidence-log`
   (+ `cad-doc-data-structures` quando o detalhe for estrutura/atributo) — para **reler
   apenas aquele trecho** e gravar o detalhe como **fato neutro novo** (ex.: `EV-090`),
   marcado como originado de aprofundamento. Ao invocar a descoberta, sinalize o passo
   com o env `CAD_APROFUNDAMENTO=1` (o hook de isolamento só libera escrita da descoberta
   no substrato sob esse sinal). Em seguida, o doc-skill **relê o substrato** e escreve o
   artefato **citando `EV-090`**.
2. **Fonte autorizada, mas caminho não resolvido no workspace.** Se o `EV` referencia
   uma fonte de `sources.json` mas o caminho composto (`caminho` + `Fonte`) **não existe**
   no workspace — ou falta o `SRC` que permitiria compô-lo — **não degrade em silêncio**
   (o bug que originou "0 releituras"). Abra item de backlog explícito
   (`consumidor: <técnica>`) sinalizando **"fonte autorizada não localizada — confirmar
   caminho/base da SRC-XXX"**, e **avise em destaque na saída** que o aprofundamento não
   pôde reler por caminho irresolvível (não por ausência de permissão). Assim o consultor
   sabe que basta trazer o código à pasta ou corrigir a base, sem re-escanear do zero.
3. **Fonte nova, ou `pode_aprofundar == "nao"`, ou flag `--sem-aprofundamento`.**
   **Não há releitura automática.** Abra item de backlog (`consumidor: <técnica>`)
   para o humano escopar a fonte (`/cad:discovery`) ou responder (`/cad:backlog`).
   Nunca invente, nunca infira, **nunca leia uma fonte nova por conta própria**.

Por que preserva a arquitetura: o atributo no artefato **ainda cita um `EV`**
(auditabilidade); "a classe tem os campos x, y, z" é **descritivo** (substrato),
enquanto "isto é um objeto de valor" é opinião do módulo (artefato); a escrita no
substrato é da **descoberta**, não do módulo (isolamento intacto — o hook bloqueia
um skill de módulo que tente escrever `docs/cad/`); e a releitura fica **restrita a
fontes que o humano já autorizou** (princípio 6 refinado — fonte nova sempre volta
ao humano).

Conte quantas fontes autorizadas foram reaprofundadas neste run — esse número vai
para o `state.json` (campo `aprofundamentos` da sessão).

## Saída ao final

Atualize `state.json` (append no histórico), **carimbando o campo `aprofundamentos`**
com o nº de fontes autorizadas reaprofundadas nesta sessão (0 quando não houve, ou
sob `--sem-aprofundamento`). Liste os artefatos gerados/atualizados em
`docs/<técnica>/`, as lacunas de síntese abertas (`consumidor: <técnica>`), os
aprofundamentos realizados e um resumo de cobertura da técnica.

## Regras inegociáveis

- Lê só o substrato; escreve só na própria pasta (princípios 2 e 3).
- Isolamento por técnica — nenhum vazamento de vocabulário entre métodos.
- Rastreabilidade preservada (princípio 11): todo fato vem do substrato.
- Fidelidade ao método de origem (princípio 10): templates fixos das seções 8.2/8.3.
- **Escopo de scan é humano; releitura, só de fontes já autorizadas (princípio 6
  refinado).** O aprofundamento relê **apenas** fontes registradas em `sources.json`,
  apontadas por um `EV`. **Fonte nova sempre volta ao humano** (backlog), nunca é
  lida automaticamente. Só a **descoberta** escreve o substrato; o módulo, nunca.
