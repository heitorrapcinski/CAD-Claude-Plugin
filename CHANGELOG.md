# Changelog

Todas as mudanças relevantes deste plugin. O formato segue, de modo leve,
[Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e a versão adota
[SemVer](https://semver.org/lang/pt-BR/). A fonte da verdade da estratégia é a
especificação em [`docs/cad-plugin-spec-v13.md`](docs/cad-plugin-spec-v13.md).

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
