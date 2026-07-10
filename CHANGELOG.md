# Changelog

Todas as mudanças relevantes deste plugin. O formato segue, de modo leve,
[Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e a versão adota
[SemVer](https://semver.org/lang/pt-BR/). O racional de design vive em
[`DESIGN.md`](DESIGN.md); este arquivo é o histórico de mudanças.

## [0.4.0] — 2026-07-10

Nova **estratégia de extração de conhecimento na descoberta**: o substrato neutro deixa
de ser 7 arquivos planos e passa a ser um **Knowledge Vault Zettelkasten/Obsidian** para
engenharia reversa de um System of Record. Skills do substrato: **7 → 9**.

> **Escopo.** Esta versão migra **apenas** a descoberta e o substrato. Os módulos de
> técnica (`lean-inception`, `ddd`, `event-storming`) ainda leem os arquivos planos antigos
> e ficam **pendentes de migração para o vault na 0.5.0** — `/cad:synthesize` avisa a
> pendência em vez de inventar conteúdo.

### Adicionado

- **Knowledge Vault em `docs/cad/`** — taxonomia numerada `01…13`, dividida na filosofia
  **Knowledge (01–08)** × **Discovery (09–13)**: `01 Overview`, `02 Business Knowledge`,
  `03 Structural Knowledge`, `04 Behavioral Knowledge`, `05 Source Code`, `06 Data`,
  `07 Integrations`, `08 Operational Architecture`, `09 Evidence`, `10 Decisions`,
  `11 Investigations`, `12 Views`, `13 MOCs`. Cada nota é atômica, em Markdown pronto para
  o Obsidian, com **frontmatter YAML** (`title`, `aliases`, `tags`, `type`, `status`,
  `source`, `author`, `created`), `[[links internos]]`, callouts e Mermaid/PlantUML.
- **Descoberta com cobertura total, faseada por valor.** A `/cad:discovery` **não negocia
  escopo nem profundidade** — a fonte autorizada é sempre lida por inteiro, no maior nível de
  detalhe (coletar menos enviesaria o humano). O que escala com o esforço é o **faseamento**:
  esforço pequeno = **uma etapa**; esforço grande = **várias etapas de valor** (por
  módulo/subsistema), cada uma cobrindo integralmente a sua fatia, com o humano decidindo
  **ordem e checkpoints** (não o quanto coletar) e o `state.json` registrando as etapas para
  **retomar entre sessões** até 100%. Dentro de uma etapa grande, o trabalho é paralelizado
  em **map-reduce**: subagentes fazem o *map* (extrair/escrever a sua sub-fatia) e só o
  orquestrador faz o *reduce* (MOCs, dedup e conflito entre fontes), consolidando contra o
  vault acumulado. **IDs sem colisão** (worker-id + sequência): `SRC-NNN` com escritor único
  e evidências `EV-<sessão>-<agente>-<seq>` por subagente (ou `EV-<sessão>-<seq>` no modo de
  1 agente). Degrada para 1 agente se o runtime não tiver subagentes. Seção 3.3 do `DESIGN.md`.
- **9 skills novas do substrato**, espelhando as duas partes:
  - Backbone: **`cad-doc-conventions`** (schema de frontmatter, componentes, taxonomia,
    tipos/status de nota, filosofia Knowledge×Discovery — fonte única de convenções).
  - Knowledge: **`cad-doc-business`** (01+02), **`cad-doc-system`** (03+04),
    **`cad-doc-technical`** (05+06+07+08).
  - Discovery: **`cad-doc-evidence`** (09 + MOC Registro de Evidências),
    **`cad-doc-decisions`** (10), **`cad-doc-investigations`** (11),
    **`cad-doc-views`** (12), **`cad-doc-mocs`** (13).

### Alterado

- **Rastreabilidade no frontmatter + `09 Evidence`.** Some o `evidence-log.md` monolítico
  (`EV-XXX` em tabela) e os marcadores inline `[Fonte: EV-XXX]`: a evidência vira uma
  **nota** em `09 Evidence` (o artefato real — trecho de código, SQL, log, config,
  entrevista), e cada nota de conhecimento aponta para ela via `source:` / `[[EV-XXX]]`. Um
  **MOC "Registro de Evidências"** (13) indexa tudo. Mantêm-se `SRC-XXX`/`sources.json`.
- **Backlog → `11 Investigations`.** O `backlog.md` (`BL-XXX`) é substituído por notas de
  investigação (perguntas, hipóteses, conflitos, lacunas), com `status`
  (`open`/`conflicting`/`confirmed`/`validated`). O comando **`/cad:backlog` permanece**,
  repaginado para conduzir a **validação humana** sobre essas notas (a evidência mais forte).
- **`/cad:discovery` reescrita** para varrer a fonte por inteiro e materializar o vault:
  captura a evidência primeiro (09), materializa o conhecimento (01–08) ligado a ela, abre
  investigações (11) para lacunas/conflitos e mantém Views (12) e MOCs (13).
- **Módulos de técnica (Lean/DDD/Event Storming) migrados para o vault.** Os três
  `module.json` passam a declarar **pastas do vault** em `entradas_substrato`; os 13
  doc-skills consomem essas pastas e trocam a citação por wikilink — `EV-XXX` →
  `[[EV-… · resumo|EV-…]]`, cross-refs de substrato por nome de nota (`[[Regra - …]]`,
  `[[Capacidade - …]]`, glossário/conceitos), e `[⚠️ Pendente: BL-XXX]` →
  `[⚠️ Pendente: [[Investigação - …]]]`. Os artefatos seguem **fiéis ao método** (só muda a
  mecânica de citação). `/cad:synthesize` reescrito: valida pastas do vault, abre
  `11 Investigations` para lacunas de síntese e **nunca lê a fonte**.
- **Hook `validate-evidence` em dois modos:** para `docs/cad/**` (vault, aninhado) exige
  **frontmatter com `source:`** não-vazio (escalar ou lista YAML; isentas `11 Investigations`,
  `12 Views`, `13 MOCs`); para `docs/<técnica>/*.md` (artefato de técnica) exige que todo
  bloco factual cite `[[EV-…]]` ou marque `Pendente`.
- **Hook `protect-human-validation`** passa a reconhecer também `status: validated` no
  frontmatter, além das frases de "validação humana".

### Corrigido

- **Links órfãos de evidência no Obsidian.** Referenciar uma evidência pelo **código
  sozinho** (`[[EV-5-a2-007]]`) não resolvia — o Obsidian resolve `[[...]]` pelo **nome do
  arquivo**, não pelo `alias` de frontmatter, gerando nós órfãos no grafo. Convenção
  corrigida: citar a evidência **pelo título completo** com o código como exibição —
  `[[EV-5-a2-007 · Aprovação exige duas alçadas|EV-5-a2-007]]`. Como as evidências são
  imutáveis, o título é estável e o link não quebra. Ajustado em `cad-doc-conventions`
  (nova regra "Como referenciar uma evidência"), `cad-doc-evidence`, `cad-discovery` e nos
  exemplos das skills do vault.
- **Múltiplas evidências no `source:` do frontmatter.** Vários `[[...]]` numa **mesma
  string** não resolvem no Obsidian (não há separação por vírgula). Convenção: usar **lista
  YAML** (um link por item). O hook `validate-evidence` foi ajustado para reconhecer
  `source:` tanto na forma **escalar** quanto em **lista YAML** — antes, a lista deixava o
  valor inline vazio e a nota era bloqueada indevidamente.

### Removido

- Skills `cad-doc-knowledge-base`, `cad-doc-vocabulary`, `cad-doc-business-rules`,
  `cad-doc-capabilities`, `cad-doc-data-structures`, `cad-doc-evidence-log` e
  `cad-doc-backlog` (absorvidas pelas 9 skills novas do vault).
- **Aprofundamento sob demanda** (o mecanismo pelo qual a síntese relia uma fonte já
  autorizada para detalhe fino). Como a descoberta agora garante **cobertura total na maior
  profundidade**, o vault já entrega os atributos/estruturas (`03 Structural`/`06 Data`) e a
  releitura ficou redundante. Saíram o campo de contrato `pode_aprofundar`, a flag
  `--sem-aprofundamento`, o contador `aprofundamentos` (`state.json`), o env
  `CAD_APROFUNDAMENTO` (hook `technique-isolation`) e os helpers `PodeAprofundar`/`canDeepen`
  (`src/lib/manifest.ts`). O campo `state.json` `backlog_abertos` virou `investigacoes_abertas`.

## [0.3.0] — 2026-07-09

Estruturas de dados no substrato neutro e uma reorganização da documentação que
desacopla o plugin da especificação. Skills: **25 → 26**.

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

### Documentação

- **Especificação versionada → `DESIGN.md` vivo.** `docs/cad-plugin-spec-v13.md`
  (v13.8) vira `DESIGN.md` na raiz, **desversionado**: sai o andaime de versão
  (frontmatter `versao`/`substitui` e as seções "0.x — o que mudou de vX→vY", que
  duplicavam este CHANGELOG). A versão vive no `package.json`, o histórico aqui, o
  diff no git.
- **"Fonte da verdade" esclarecida.** README e CHANGELOG deixam de apontar a spec
  como fonte da verdade; `DESIGN.md` passa a ser o **racional de design** (o porquê).
- **Skills auto-contidas.** Removidas de todas as skills as referências à numeração
  do `DESIGN.md` (`seção N`, `princípio N`) — uma skill é artefato de runtime e não
  pode depender de um documento que não vai no pacote `.plugin`. Alinha às boas
  práticas de autoria de Skills da Anthropic.
- **Seção 8 do `DESIGN.md` desduplicada.** Os templates dos artefatos de `docs/` (que
  já viviam nos `SKILL.md`) saem do documento, substituídos por um ponteiro
  pasta→skill; fica só a `8.0` (controle JSON), sem lar em skill. `DESIGN.md`:
  1276 → 852 linhas.
- **Comentários de código desacoplados** da spec (`src/lib/manifest.ts`, `build.mjs`).

## [0.2.0] — 2026-07-02

Entram duas funcionalidades: módulo Event Storming e aprofundamento sob demanda. Skills: **20 → 25**.

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
