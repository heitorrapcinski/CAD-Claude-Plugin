# Changelog

Todas as mudanças relevantes deste plugin. O formato segue, de modo leve,
[Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e a versão adota
[SemVer](https://semver.org/lang/pt-BR/). A fonte da verdade da estratégia é a
especificação em [`docs/cad-plugin-spec-v13.md`](docs/cad-plugin-spec-v13.md).

## [Não lançado]

Trabalho em validação nesta branch (delta v13.7 → v13.8 da spec). Skills: **25 → 26**.
Ainda **não** promovido a uma versão publicada — a versão corrente permanece `0.2.0`.

### Adicionado

- **Estruturas de dados no substrato neutro** — novo artefato
  `docs/cad/data-structures.md` e skill **`cad-doc-data-structures`**. A descoberta
  passa a **front-carregar** as estruturas de dados do código e da documentação em
  nível **conceitual/lógico e neutro**: campos, valores enumerados, **exemplos de
  preenchimento**, **formato/tamanho derivado** dos exemplos e **relações com
  multiplicidade** (`1..1`, `1..n`, `0..n`).
  - **Sem contaminação de tecnologia:** regra manter/descartar no skill barra tipos
    técnicos, nomes de tabela/coluna, FKs e tabelas-pivô. **Exemplos no lugar de
    tipos** (a máscara/tamanho é derivada do exemplo). **Trava anti-PII:** exemplos só
    de validação/default/máscara/fixture/sintético — nunca de dado real.
  - Invocado por `/cad:discovery` e `/cad:backlog`.

### Alterado

- **DDD tático consome `data-structures.md` como fonte primária** de atributos e
  relações; o **aprofundamento sob demanda vira rede de segurança**, não o caminho
  principal. `data-structures.md` entra em `entradas_substrato` do `ddd-module`.
- **Correção da resolução de fonte no aprofundamento (o bug "0 releituras").**
  - `evidence-log.md` ganha a coluna **`SRC`**, ligando cada `EV` à fonte de
    `sources.json`. O caminho real é composto por `sources.json[SRC].caminho` +
    `Fonte`/`Localização` do `EV` (a `Fonte` é relativa à `caminho` da SRC).
  - `cad-synthesize` ganha o **branch que faltava**: fonte **autorizada mas com
    caminho não localizado** no workspace **não degrada mais em silêncio** — abre
    backlog "confirmar caminho/base da SRC" e avisa na saída.
- Spec atualizada para **v13.8** (seções 0.9, 3.1/3.2, 4, 5, 5.1, 6, 8.0, 8.1, 8.3, 9).

## [0.2.0] — 2026-07-02

Entram duas funcionalidades da spec v13.7 (deltas v13.6 e v13.7). Skills: **20 → 25**.

### Adicionado

- **Módulo de técnica Event Storming (Alberto Brandolini)** — 1 manifesto +
  4 doc-skills:
  - `event-storming-module` (+ `module.json`): pasta `docs/event-storming/`,
    6 entradas de substrato (inclui `docs/cad/backlog.md`, de onde saem os
    hotspots), 4 artefatos e vocabulário exclusivo proibido.
  - `event-storming-doc-timeline` (`timeline.md` — eventos de domínio no passado +
    eventos-pivô), `event-storming-doc-flows` (`flows.md` — fatias Ator → Comando →
    Agregado → Evento → Read Model → Política), `event-storming-doc-hotspots`
    (`hotspots.md` — conflitos/dúvidas vindos do backlog/evidence-log) e
    `event-storming-doc-boundaries` (`boundaries.md` — contextos candidatos dos
    pivôs + sistemas externos).
- **Aprofundamento sob demanda** — a síntese pode reler **fontes já autorizadas**
  (apontadas por um `EV` em `sources.json`), via os skills de descoberta, para
  extrair detalhe fino (ex.: atributos de um agregado no DDD), gravando o detalhe
  como **fato neutro novo**; fonte nova sempre volta ao humano (backlog).
  - Campo de contrato `pode_aprofundar` nos três `module.json`
    (`lean-inception="nao"`, `ddd`/`event-storming="fontes-autorizadas"`),
    tipado em `src/lib/manifest.ts` (com o helper `canDeepen`).
  - Fluxo descrito em `cad-synthesize`; flag de run `--sem-aprofundamento`
    (modo conservador); contador `aprofundamentos` por sessão em `state.json`.
  - Evidências originadas de aprofundamento marcadas com `_(aprofundamento)_`
    na tabela de evidências, para auditoria.

### Alterado

- **Distinção vocabulário compartilhado × exclusivo** (seção 5): o
  `vocabulario_proibido` barra só as assinaturas **exclusivas** de outra técnica.
  O DDD passa a barrar `hotspot` e `evento-pivô / pivotal event` (só-ES); o Event
  Storming barra os blocos só-DDD (objeto de valor, repositório, subdomínio,
  ACL/OHS/mapa de contextos, linguagem ubíqua) e os da Lean. Os termos
  compartilhados entre ES e DDD (`aggregate`, `domain event`, `command`, `policy`,
  `read model`, `bounded context`) **não** são barrados.
- **Descoberta dinâmica de módulos** — `cad-synthesize` seleciona a técnica pelo
  glob de `skills/*-module/module.json` (sem lista fixa de técnicas no código).
- **Hook `technique-isolation`** — diferencia ator-descoberta (env
  `CAD_APROFUNDAMENTO`, que libera a escrita da descoberta em `docs/cad/`) de
  ator-módulo (bloqueado ao tentar escrever o substrato).
- **Princípio 6 refinado** em `cad-discovery`/`cad-synthesize`: releitura
  automática só de fontes já autorizadas; fonte nova sempre volta ao humano.
- Versão espelhada em `package.json` e `.claude-plugin/plugin.json`.

## [0.1.0]

- Núcleo do CAD: 3 orquestradores (`/cad:discovery`, `/cad:synthesize`,
  `/cad:backlog`), 6 skills do substrato neutro, módulos Lean Inception (7) e
  DDD (4), 3 hooks de enforcement e o toolchain Node.js + TypeScript
  (esbuild, zero dependências de runtime, empacotamento `.plugin` sem `.mcpb`).
