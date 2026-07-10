---
documento: Documento de Design (vivo)
projeto: Plugin Claude Code/Cowork — Collaborative Augmented Discovery (CAD)
status: vivo — descreve o estado atual do design
---

# CAD — Documento de Design

> **Documento vivo.** Descreve o **estado atual** do design do plugin — princípios,
> arquitetura, contrato de módulo, schemas e enforcement: o *porquê* das decisões.
> **Não é versionado e não registra histórico.** A versão publicada vive no
> `package.json`; o histórico de mudanças, em [`CHANGELOG.md`](CHANGELOG.md); e o diff
> linha a linha, no git. Para *o que é* e *como usar*, veja o [`README.md`](README.md).

## 1. Visão geral

Plugin instalável no Claude Code/Cowork que atua como **co-facilitador de
descoberta aumentada (CAD)** para consultores entrando em sistemas e organizações
já existentes, e que depois **sintetiza** esse conhecimento em artefatos fiéis a
métodos específicos — a começar pela Lean Inception (método de Paulo Caroli).

Três comandos cobrem o ciclo:

- **`/cad:discovery [fontes]`** — escaneia exatamente as fontes indicadas pelo
  consultor (código, documentação, normativos), percorrendo-as por inteiro, e estrutura o
  conhecimento como um **Knowledge Vault** (Zettelkasten/Obsidian) no **substrato neutro**
  (`docs/cad/`): notas atômicas com frontmatter, distribuídas na taxonomia `01…13`
  (Knowledge 01–08 · Discovery 09–13). Tudo que não tem evidência clara vira uma nota em
  `11 Investigations`.
- **`/cad:synthesize <técnica> [escopo]`** — roda um **módulo de técnica**: lê o
  substrato neutro e gera/atualiza **apenas** os artefatos daquela técnica em
  `docs/<técnica>/`. Ex.: `/cad:synthesize lean-inception`. Lacunas específicas da técnica
  vão para o backlog, marcadas com o consumidor de origem.
- **`/cad:backlog [nota...]`** — apresenta as **investigações** abertas (`11 Investigations`)
  em formulário ao consultor, resolve, grava a resposta como evidência de "Validação
  Humana" (`09 Evidence`) e atualiza as notas afetadas (do substrato e/ou dos módulos).
  Aceita títulos explícitos; sem argumento, lista todas as investigações abertas.

Uso previsto: consultor individual, conduzindo sessões com cliente ao longo de
múltiplos dias/semanas.

> **Estado da migração (0.4.0).** A **descoberta e o substrato** já operam no modelo
> Knowledge Vault descrito neste documento. Os **módulos de técnica** (`lean-inception`,
> `ddd`, `event-storming`) e o `/cad:synthesize` ainda consomem o substrato plano anterior
> (arquivos `knowledge-base.md`, `evidence-log.md`, `vocabulary.md`, `business-rules.md`,
> `capabilities.md`, `data-structures.md`, `backlog.md`) e estão **pendentes de migração
> para o vault na 0.5.0**. As menções a esses arquivos e a marcadores `[Fonte: EV-XXX]`/
> `[⚠️ Pendente: BL-XXX]` nas seções 5–8 refletem o **modelo pré-migração dos módulos**.

---

## 2. Princípios fundamentais (não-negociáveis)

1. **Sem evidência, sem afirmação.** Nenhum agente registra um fato sem fonte
   rastreável. No vault, a fonte de cada nota vive numa nota de `09 Evidence` (o artefato
   real), referenciada pelo `source:` do frontmatter. Lacunas viram notas em
   `11 Investigations`, nunca são preenchidas por inferência silenciosa.
2. **Substrato neutro.** A descoberta (`/cad:discovery`) produz conhecimento
   **descritivo e independente de método**. Opinião metodológica (priorizar,
   sequenciar, delimitar contextos, nomear eventos) vive **somente** nos módulos de
   técnica (`/cad:synthesize`).
3. **Isolamento por técnica.** Cada módulo lê apenas `docs/cad/` (o substrato) e
   escreve apenas a sua própria pasta `docs/<técnica>/`. **Nenhum módulo lê ou
   escreve artefatos de outra técnica.** A fidelidade ao método é garantida pela
   fronteira de pasta + skill, e reforçada por hook (seção 10).
4. **Hierarquia de fontes para conflitos:** (1) Normativo/regulatório → (2)
   Documentação corporativa oficial → (3) Código-fonte → (4) Documentação técnica
   informal. A de maior hierarquia prevalece na definição priorizada; todas as
   divergências são registradas, nunca escondidas.
5. **Validação humana é a evidência mais forte.** Uma resposta do consultor via
   `/cad:backlog` supera até a hierarquia normativa — é julgamento informado de
   especialista sobre o caso concreto.
6. **Escopo de scan é sempre humano — releitura, só de fontes já autorizadas.**
   `/cad:discovery` trabalha só nas fontes passadas explicitamente e nunca escaneia por
   conta própria uma fonte **nova**. A síntese (`/cad:synthesize`) pode, no
   **aprofundamento sob demanda** (seção 5.1), reler **fontes já autorizadas**
   (registradas em `sources.json`) para extrair detalhe fino — mas qualquer fonte nova
   volta ao humano como item de backlog.
7. **Conteúdo validado por humano é protegido.** Nem `/cad:discovery` nem
   `/cad:synthesize` sobrescrevem, em execuções futuras, um bloco cuja origem é
   validação humana. Conflito novo gera item de backlog (`conflito_pós_validação`).
8. **Apêndice, nunca sobrescrita.** Toda fonte retrabalhada soma uma nova entrada
   de sessão em `sources.json`; o histórico nunca é perdido.
9. **`docs/` em Markdown; controle em JSON.** `docs/*` é entregável com leitor
   humano — legibilidade importa. `state.json`/`sources.json` não têm leitor humano
   — JSON garante edição programática segura e parsing determinístico.
10. **Templates fixos, fiéis ao método de origem.** Sem variação de estrutura por
    cliente. Cada artefato de módulo segue fielmente o método que o originou (a Lean
    Inception segue o livro de Caroli; o DDD segue Eric Evans; etc.).
11. **Rastreabilidade embutida no próprio arquivo.** Qualquer nota do vault, aberta
    isoladamente, mostra de onde vêm seus fatos pelo `source:` do frontmatter (apontando
    para uma nota de `09 Evidence`); o que ainda não tem fonte é uma nota em
    `11 Investigations`. (Nos módulos ainda não migrados, a marca é inline: `[Fonte:
    EV-XXX]` / `[⚠️ Pendente: BL-XXX]`.)

---

## 3. Arquitetura

Duas estruturas distintas: a do **plugin instalável** (instalado uma vez) e a dos
**documentos gerados** (criados a cada projeto, no repositório do cliente).

### 3.0 Convenção de nomenclatura (regra única)

Para evitar ambiguidade (como o antigo `lean-module`), toda técnica tem um **nome
programático** fixo, e **todos** os seus identificadores derivam dele:

| Técnica | Nome completo | Nome (exibição) | Nome programático | Padrão de skill / pasta |
|---|---|---|---|---|
| Lean Inception | Lean Inception (Paulo Caroli) | Lean Inception | `lean-inception` | `lean-inception-<adição>` |
| Domain-Driven Design | Domain-Driven Design (Eric Evans) | Domain-Driven Design | `ddd` | `ddd-<adição>` |
| Event Storming | Event Storming (Alberto Brandolini) | Event Storming | `event-storming` | `event-storming-<adição>` |
| (plataforma) | Collaborative Augmented Discovery | CAD | `cad` | `cad-<adição>` |

Regras derivadas, válidas para qualquer técnica (atual ou futura):

- **Skill de manifesto:** `<programático>-module` → `lean-inception-module`, `ddd-module`.
- **Skill de documento:** `<programático>-doc-<artefato>` → `lean-inception-doc-personas`, `ddd-doc-strategic`.
- **Pasta de saída:** `docs/<programático>/` → `docs/lean-inception/`, `docs/ddd/`.
- **Argumento de comando:** `/cad:synthesize <programático>` → `/cad:synthesize lean-inception`, `/cad:synthesize ddd`.
- **Marcação de backlog:** `consumidor: <programático>` → `consumidor: lean-inception`.
- **Nome completo e de exibição** são usados apenas em prosa e no campo
  `metodo_de_origem` do manifesto; nunca em identificadores programáticos.

### 3.1 Estrutura do plugin (instalável + controle de execução)

Skills divididas em três camadas: **orquestradores** (3 comandos), **skills do
substrato CAD** (camada neutra) e **skills de módulo de técnica** (uma família por
método). Os orquestradores delegam aos skills de documento/módulo; nunca duplicam
a lógica.

```
cad-claude-plugin/
├── .claude-plugin/
│   └── plugin.json                               # manifesto Claude Code (espelha a versão)
├── hooks/
│   └── hooks.json                                # enforcement dos princípios 1, 3 e 7
├── skills/
│   ├── cad-discovery/                            # orquestrador: /cad:discovery
│   │   └── SKILL.md
│   ├── cad-synthesize/                           # orquestrador: /cad:synthesize <técnica>
│   │   └── SKILL.md
│   ├── cad-backlog/                              # orquestrador: /cad:backlog
│   │   └── SKILL.md
│   │
│   ├── cad-doc-conventions/                      # ── substrato neutro (Knowledge Vault) ──
│   │   └── SKILL.md                              # backbone: frontmatter, taxonomia, filosofia
│   ├── cad-doc-business/                         # Knowledge 01 Overview + 02 Business
│   │   └── SKILL.md
│   ├── cad-doc-system/                           # Knowledge 03 Structural + 04 Behavioral
│   │   └── SKILL.md
│   ├── cad-doc-technical/                        # Knowledge 05 Code + 06 Data + 07 Integr. + 08 Ops
│   │   └── SKILL.md
│   ├── cad-doc-evidence/                         # Discovery 09 Evidence + MOC de evidências
│   │   └── SKILL.md
│   ├── cad-doc-decisions/                        # Discovery 10 Decisions (ADRs, premissas)
│   │   └── SKILL.md
│   ├── cad-doc-investigations/                   # Discovery 11 Investigations (substitui o backlog)
│   │   └── SKILL.md
│   ├── cad-doc-views/                            # Discovery 12 Views (Mermaid/PlantUML)
│   │   └── SKILL.md
│   ├── cad-doc-mocs/                             # Discovery 13 MOCs (mapas navegáveis)
│   │   └── SKILL.md
│   │
│   ├── lean-inception-module/                    # ── módulo de técnica: Lean Inception ──
│   │   ├── SKILL.md                              # manifesto humano (prosa)
│   │   └── module.json                           # contrato enforceável (JSON) — seção 5
│   ├── lean-inception-doc-product-framing/       # vision + ENFN + objetivos
│   │   └── SKILL.md
│   ├── lean-inception-doc-personas/
│   │   └── SKILL.md
│   ├── lean-inception-doc-features/              # brainstorming + revisão semáforo/tabela
│   │   └── SKILL.md
│   ├── lean-inception-doc-journeys/
│   │   └── SKILL.md
│   ├── lean-inception-doc-sequencer/             # sequenciador + esforço/tempo/custo
│   │   └── SKILL.md
│   ├── lean-inception-doc-mvp-canvas/
│   │   └── SKILL.md
│   │
│   ├── ddd-module/                               # ── módulo de técnica: DDD ──
│   │   ├── SKILL.md                              # manifesto humano (prosa)
│   │   └── module.json                           # contrato enforceável (JSON) — seção 5
│   ├── ddd-doc-strategic/                        # subdomínios + bounded contexts + mapa de contextos
│   │   └── SKILL.md
│   ├── ddd-doc-ubiquitous-language/              # linguagem ubíqua POR bounded context
│   │   └── SKILL.md
│   ├── ddd-doc-tactical/                         # agregados, entidades, VOs, eventos, repositórios
│   │   └── SKILL.md
│   │
│   ├── event-storming-module/                    # ── módulo de técnica: Event Storming ──
│   │   ├── SKILL.md                              # manifesto humano (prosa)
│   │   └── module.json                           # contrato enforceável (JSON) — seção 5
│   ├── event-storming-doc-timeline/              # eventos de domínio + eventos-pivô
│   │   └── SKILL.md
│   ├── event-storming-doc-flows/                 # ator, comando, agregado, evento, read model, política
│   │   └── SKILL.md
│   ├── event-storming-doc-hotspots/              # hotspots (conflitos/dúvidas), vindos do backlog
│   │   └── SKILL.md
│   └── event-storming-doc-boundaries/            # contextos candidatos + sistemas externos
│       └── SKILL.md
└── README.md
```

Total: **28 skills** = 3 orquestradores + 9 do substrato CAD (Knowledge Vault) + módulo
Lean (1 manifesto + 6 docs) + módulo DDD (1 manifesto + 3 docs) + módulo Event Storming (1
manifesto + 4 docs). Cada módulo de técnica futuro (Impact Mapping, User Story
Mapping…) adiciona 1 manifesto + N skills de documento, sob o mesmo contrato (seção 5),
sem tocar no núcleo.

> **Nota sobre granularidade de skill.** Em vez de "1 skill por
> arquivo", adota-se "**1 skill por grupo coeso de artefatos da mesma atividade
> do método**". Ex.: `lean-inception-doc-product-framing` cuida das três atividades de
> definição do produto de Caroli (Visão, ENFN, Objetivos), que andam juntas. Isso
> reduz dispersão sem comprometer a fidelidade — cada arquivo continua sendo um
> artefato distinto na pasta da técnica.

> **Nota de implementação.** A árvore acima mostra a camada de skills/contrato. A
> camada de engenharia — `package.json`, `tsconfig.json`, `src/` (TypeScript dos
> hooks e helpers), os scripts `.mjs` de build/empacotamento e o `build/` compilado —
> está detalhada na **seção 11 (Linguagem, build e versionamento)**. Cada `*-module/`
> carrega, além do `SKILL.md` (manifesto humano), um `module.json` (contrato
> enforceável, lido pelos hooks e pelo `cad-synthesize`).

Cada skill de documento segue a mesma estrutura interna:

```
SKILL.md
├── Objetivo        → que pergunta o artefato responde, e a qual método pertence
├── Entradas        → quais documentos do substrato CAD ele consome
├── Template        → schema fixo, fiel ao método de origem
└── Como preencher  → regras de citação; quando gerar backlog em vez de afirmar;
                       hierarquia de fontes; vocabulário PROIBIDO de outras técnicas
```

`state.json` e `sources.json` **não** têm skill própria — são controle puro,
embutido nos orquestradores, na pasta oculta `.cad-plugin/`:

```
.cad-plugin/                  # criado no repositório do cliente, oculto
  state.json                  → fase atual, sessão, histórico de execução
  sources.json                → fontes escaneadas, por sessão
```

### 3.2 Estrutura gerada no projeto do cliente (entregáveis)

A separação substrato × método aparece diretamente na árvore de pastas. `docs/cad/`
é a base neutra; cada outra pasta de `docs/` pertence a uma técnica e contém
**apenas** artefatos daquela técnica.

```
docs/
  cad/                          # ── SUBSTRATO NEUTRO = KNOWLEDGE VAULT (Zettelkasten/Obsidian) ──
    01 Overview/                → Parte I · Knowledge — o que é (objetivo, escopo, glossário…)
    02 Business Knowledge/      → por que existe (processos, capacidades, regras, papéis)
    03 Structural Knowledge/    → do que é composto (conceitos, componentes, serviços, relações)
    04 Behavioral Knowledge/    → como funciona (fluxos, casos de uso, algoritmos, jobs)
    05 Source Code/             → como foi implementado (classes, métodos, padrões, dependências)
    06 Data/                    → que informações manipula (tabelas, views, procedures, modelos)
    07 Integrations/            → com quem se comunica (REST/SOAP, filas, batch, externos)
    08 Operational Architecture/→ como opera em produção (compute, deploy, monitoração, HA/DR)
    09 Evidence/                → Parte II · Discovery — evidências (EV-XXX; o artefato real)
    10 Decisions/               → conclusões da análise (ADRs, premissas, hipóteses confirmadas)
    11 Investigations/          → o que falta investigar (substitui o backlog)
    12 Views/                   → visões gráficas (Mermaid/PlantUML)
    13 MOCs/                    → mapas navegáveis (incl. Registro de Evidências)
    # cada nota: frontmatter YAML + [[links]] + callouts; Knowledge 01–08 · Discovery 09–13

  lean-inception/               # ── TÉCNICA: Lean Inception (fiel a Caroli) — pendente de migração ──
    vision.md                   → Visão do Produto (template de Geoffrey Moore)
    product-enfn.md             → É – Não é – Faz – Não faz
    objectives.md               → Objetivos do produto (+ trade-offs)
    personas.md                 → Personas (+ mapa de empatia)
    features.md                 → Funcionalidades (brainstorming + revisão)
    journeys.md                 → Jornadas dos usuários
    sequencer.md                → Sequenciador (ondas, regras, MVPs, esforço/custo)
    mvp-canvas.md               → Canvas MVP (7 blocos)

  ddd/                          # ── TÉCNICA: DDD (fiel a Eric Evans) ──
    subdomains.md               → subdomínios Core / Supporting / Generic
    bounded-contexts.md         → contextos delimitados + módulos de código + acoplamento
    ubiquitous-language.md      → linguagem ubíqua POR bounded context
    context-map.md              → relacionamentos entre contextos (ACL, OHS, Shared Kernel…)
    aggregates.md               → agregados, entidades, objetos de valor, eventos, repositórios

  event-storming/               # ── TÉCNICA: Event Storming (fiel a Brandolini) ──
    timeline.md                 → eventos de domínio (passado) em ordem + eventos-pivô
    flows.md                    → fatias: ator → comando → agregado → evento → read model → política
    hotspots.md                 → problemas/conflitos/dúvidas (vindos do backlog/evidence-log)
    boundaries.md               → contextos candidatos (dos pivôs) + sistemas externos

  # impact-mapping/ , user-story-mapping/ , ...  (consumidores futuros, seção 12)
```

Cada técnica nova é uma pasta nova; o substrato `docs/cad/` é compartilhado por
todas. **Nunca** há conceito de uma técnica dentro da pasta de outra.

### 3.3 Modelo de execução da descoberta (cobertura total, faseada por valor)

**Cobertura total e profundidade máxima são inegociáveis.** A fonte autorizada é lida por
inteiro, no maior nível de detalhe — a descoberta **nunca** oferece coletar menos (ou raso)
para poupar esforço, pois um retrato parcial enviesa o humano. O consultor decide **quais
fontes** autorizar; uma vez autorizada, a fonte é coberta 100%.

O que escala com o esforço é **só o faseamento** — entregar a cobertura total em **etapas de
valor**, não reduzir a cobertura:

- **Esforço pequeno → uma etapa.** Um passe cobre tudo, usando o **vault em disco como
  memória** entre áreas.
- **Esforço grande → várias etapas por valor.** O orquestrador particiona a fonte em fatias
  coesas (por **módulo/subsistema** de preferência) e as processa **etapa a etapa**, cada uma
  cobrindo **integralmente** a sua fatia, na maior profundidade. O **humano decide a ordem e
  os checkpoints** — não o escopo nem a profundidade. Só ao fim da última etapa a cobertura
  fecha 100%; o `state.json` registra as etapas concluídas para **retomar entre sessões**.

Dentro de uma etapa grande, o trabalho pode ser paralelizado em **map-reduce**. A separação
**map × reduce** é o que preserva os invariantes do CAD sob paralelismo:

| Fase | Ator | Faz |
|---|---|---|
| Preparação | Orquestrador | Registra fontes (`SRC-NNN`, **escritor único**), incrementa a sessão, **monta o plano de etapas** (particiona por valor, sem cortar cobertura) e atribui um **id** por subagente (`a1`, `a2`…). |
| **Map** | Subagentes (paralelo) | Cada um varre **só a sua sub-fatia** (por inteiro), captura evidência (`09 Evidence`, id `EV-<sessão>-<agente>-<seq>`) e materializa as notas de Knowledge ligadas por `source:`; abre investigações locais. **Não** escreve MOCs, **não** resolve conflito entre fatias, **não** toca `sources.json`/`state.json`. |
| **Reduce** | Orquestrador | Ao fim da etapa, consolida contra o **vault acumulado**: **MOCs** e **Registro de Evidências**, **dedup** de conceito transversal e **detecção de conflito entre fontes** (que só quem vê o todo consegue), entregando o incremento de valor da etapa. |

Como o vault em disco **acumula**, o reduce de cada etapa roda contra tudo o que já existe —
conflito com uma etapa anterior aparece quando a etapa nova aterrissa. Dois pontos de projeto
sustentam isso:

- **Identidade sem colisão** (padrão worker-id + sequência). `SRC` é atribuído uma vez
  (escritor único). As evidências usam `EV-<sessão>-<agente>-<seq>` no modo paralelo: a
  `<sessão>` (do `state.json`) garante unicidade **entre runs**, o `<agente>` (`a1`, `a2`…)
  garante que dois subagentes nunca colidam, e o `<seq>` é sequencial **por agente** — tudo
  sem RNG e sem escritor central. No modo de 1 agente, `EV-<sessão>-<seq>`. O título da nota
  é `EV-<id> · <resumo>`; para **evitar links órfãos**, as citações linkam a evidência **pelo
  título completo** com o código como exibição (`[[EV-5-a2-007 · … |EV-5-a2-007]]`), nunca
  pelo código sozinho — o Obsidian resolve `[[...]]` por nome de arquivo, não por `alias`.
  Como a evidência é imutável, o título é estável e o link não quebra. Com **várias**
  evidências, o `source:` é uma **lista YAML** (um link por item) — vários `[[...]]` numa
  mesma string de frontmatter não resolvem. O hook `validate-evidence` aceita ambas as formas.
- **Conflito e navegação são globais.** Detecção de conflito entre fontes, dedup e MOCs são
  **intrinsecamente reduce** — ficam com o orquestrador, nunca com um subagente. Links
  `[[...]]` para notas que outra fatia criará ficam pendentes no meio do caminho, o que é
  **legítimo em Zettelkasten** (sinaliza nota a criar) e é resolvido no reduce.

Os hooks (seção 10) são **agnósticos de quem escreve**: rodam em qualquer `Write`, então o
paralelismo **não enfraquece** a disciplina de evidência nem a proteção de validação humana.

---

## 4. Comandos

| Comando | Função |
|---|---|
| `/cad:discovery [fontes]` | Registra as fontes em `sources.json` → escaneia apenas elas, por inteiro → captura a evidência em `09 Evidence` (via `cad-doc-evidence`) e materializa o conhecimento como notas do vault via `cad-doc-conventions` (backbone) + `cad-doc-business` (01–02), `cad-doc-system` (03–04), `cad-doc-technical` (05–08), `cad-doc-decisions` (10), `cad-doc-views` (12), `cad-doc-mocs` (13) → abre `cad-doc-investigations` (11) para lacunas/conflitos. **Não gera nenhum artefato de técnica.** Respeita a proteção de notas validadas por humano (princípio 7). |
| `/cad:synthesize <técnica> [escopo]` | **Pendente de migração ao vault (0.5.0).** Carrega o manifesto do módulo da técnica (ex.: `lean-inception-module`) → valida que o substrato tem o mínimo necessário (senão sugere `/cad:discovery` ou aponta o backlog) → invoca os skills de documento daquele módulo, que **leem só de `docs/cad/`** e escrevem **só em `docs/<técnica>/`** → quando falta detalhe fino no substrato, aciona o **aprofundamento sob demanda** (seção 5.1). Flag opcional `--sem-aprofundamento` força o modo conservador. |
| `/cad:backlog [nota...]` | Invoca `cad-doc-investigations` para listar as investigações abertas (`11 Investigations`), filtradas por título quando informado; sem argumento, lista todas abertas → formulário de perguntas → grava resposta como evidência "Validação Humana" em `09 Evidence` (via `cad-doc-evidence`, sob `CAD_BACKLOG_FLOW=1`) → propaga a atualização às notas afetadas, no substrato (`docs/cad/`) ou no módulo da técnica indicada. |

Não há comando separado para vocabulário/glossário ou relatório de cobertura:
conflito de definição é um tipo de item de backlog; o status de cobertura é saída
de `/cad:discovery` e de `/cad:synthesize` ao final de cada execução.

---

## 5. Contrato de módulo de técnica (o núcleo da plataforma)

Este contrato é o que permite plugar DDD, Event Storming, Impact Mapping etc. sem
tocar no núcleo, e o que garante que nenhuma técnica contamine outra.

Um **módulo de técnica** é uma família de skills com um **manifesto** em duas faces:
`<x>-module/SKILL.md` (legível por humano, em prosa) e `<x>-module/module.json` (o
**contrato enforceável**, em JSON, lido pelos hooks e pelo `cad-synthesize` com
`JSON.parse` nativo — sem dependência). Campos do contrato: `tecnica` (nome
programático), `metodo_de_origem` (nome completo, só para prosa), `pode_aprofundar`
(se a síntese pode reler fontes já autorizadas para detalhe fino — ver 5.1),
`pasta_saida` (única pasta onde o módulo escreve), `entradas_substrato` (únicas fontes
que o módulo lê), `artefatos` (o que o módulo produz) e `vocabulario_proibido` (termos
de outras técnicas barrados nestes artefatos). O `module.json` do módulo Lean
Inception:

```json
{
  "tecnica": "lean-inception",
  "metodo_de_origem": "Lean Inception (Paulo Caroli)",
  "pode_aprofundar": "nao",
  "pasta_saida": "docs/lean-inception/",
  "entradas_substrato": [
    "docs/cad/knowledge-base.md",
    "docs/cad/evidence-log.md",
    "docs/cad/vocabulary.md",
    "docs/cad/business-rules.md",
    "docs/cad/capabilities.md"
  ],
  "artefatos": [
    "vision.md",
    "product-enfn.md",
    "objectives.md",
    "personas.md",
    "features.md",
    "journeys.md",
    "sequencer.md",
    "mvp-canvas.md"
  ],
  "vocabulario_proibido": [
    "bounded context",
    "agregado / aggregate",
    "evento de domínio / domain event",
    "linguagem ubíqua"
  ]
}
```

O segundo módulo plugado, o DDD, instancia o **mesmo** contrato — provando que o
substrato neutro serve a dois métodos sem mistura. Note o `vocabulario_proibido`
simétrico (barra termos da Lean) e que as `entradas_substrato` privilegiam os
documentos-ponte: `vocabulary`, `business-rules`, `capabilities` e `data-structures`
(respectivamente: linguagem ubíqua por contexto, invariantes dos agregados,
subdomínios/bounded contexts, e entidades/objetos de valor/atributos/relações):

```json
{
  "tecnica": "ddd",
  "metodo_de_origem": "Domain-Driven Design (Eric Evans)",
  "pode_aprofundar": "fontes-autorizadas",
  "pasta_saida": "docs/ddd/",
  "entradas_substrato": [
    "docs/cad/knowledge-base.md",
    "docs/cad/evidence-log.md",
    "docs/cad/vocabulary.md",
    "docs/cad/business-rules.md",
    "docs/cad/capabilities.md",
    "docs/cad/data-structures.md"
  ],
  "artefatos": [
    "subdomains.md",
    "bounded-contexts.md",
    "ubiquitous-language.md",
    "context-map.md",
    "aggregates.md"
  ],
  "vocabulario_proibido": [
    "MVP / canvas MVP",
    "persona / persona segmentada",
    "jornada (no sentido Lean)",
    "onda / sequenciador",
    "é-não é-faz-não faz",
    "hotspot",
    "evento-pivô / pivotal event"
  ]
}
```

O terceiro módulo, o Event Storming, também instancia o contrato. Ele consome ainda o
`backlog.md` (seus **hotspots** derivam dos conflitos/lacunas já registrados). O
`module.json` do Event Storming:

```json
{
  "tecnica": "event-storming",
  "metodo_de_origem": "Event Storming (Alberto Brandolini)",
  "pode_aprofundar": "fontes-autorizadas",
  "pasta_saida": "docs/event-storming/",
  "entradas_substrato": [
    "docs/cad/knowledge-base.md",
    "docs/cad/evidence-log.md",
    "docs/cad/vocabulary.md",
    "docs/cad/business-rules.md",
    "docs/cad/capabilities.md",
    "docs/cad/backlog.md"
  ],
  "artefatos": [
    "timeline.md",
    "flows.md",
    "hotspots.md",
    "boundaries.md"
  ],
  "vocabulario_proibido": [
    "MVP / canvas MVP",
    "persona / persona segmentada",
    "onda / sequenciador",
    "linguagem ubíqua",
    "objeto de valor / value object",
    "repositório / repository",
    "subdomínio (Core/Supporting/Generic)",
    "anticorruption layer / open host service / context map"
  ]
}
```

> **Nota — vocabulário compartilhado entre técnicas complementares.** O
> `vocabulario_proibido` barra os termos **exclusivos** de outra técnica, não os que
> são legitimamente **compartilhados**. Event Storming e DDD, por serem
> complementares (Brandolini e Evans se alinham), compartilham `aggregate`,
> `domain event`, `command`, `policy`, `read model` e `bounded context` — esses **não**
> entram no proibido de nenhum dos dois. Barram-se apenas assinaturas exclusivas: o ES
> barra os blocos táticos e estratégicos só-DDD (objeto de valor, repositório,
> subdomínio, mapa de contextos/ACL/OHS, linguagem ubíqua); e o DDD passa a barrar as
> assinaturas só-ES (`hotspot`, `evento-pivô / pivotal event`). Termos da Lean
> Inception são barrados em ambos.

Regras do contrato (válidas para todo módulo):

1. **Lê só o substrato.** As únicas entradas permitidas são os arquivos de
   `docs/cad/` listados em `entradas_substrato`. O módulo **não** lê `docs/` de
   outra técnica.
2. **Escreve só na própria pasta.** Toda saída vai para `pasta_saida`. Tentativa de
   escrever fora dela é bloqueada por hook (seção 10).
3. **Fidelidade ao método.** Os `artefatos` e seus templates seguem fielmente o
   método de origem — nada de inventar campos nem importar conceitos de outro
   método. `vocabulario_proibido` lista termos de outras técnicas que o hook
   rejeita se aparecerem nos artefatos do módulo.
4. **Rastreabilidade preservada.** Como todo fato vem do substrato, todo bloco
   factual carrega `[Fonte: EV-XXX]` (herdado do `evidence-log.md`) ou
   `[⚠️ Pendente: BL-XXX]`. O módulo não cria evidência nova; ele *referencia* a do
   substrato e, quando falta, abre backlog.
5. **Backlog marcado por consumidor.** Lacunas que só importam para esta técnica
   (ex.: "falta a proposta do MVP") entram no backlog com `consumidor: <técnica>`,
   para o consultor saber que são pendências de síntese, não de descoberta.
6. **Proteção de validação humana.** Igual ao substrato: blocos de artefato com
   origem "validação humana" não são sobrescritos por re-síntese; conflito gera
   `conflito_pós_validação`.

A cadeia de rastreabilidade ponta a ponta fica:

```
fonte (código/doc/norma)
  → EV-XXX (evidence-log.md)
    → fato (knowledge-base / vocabulary / business-rules / capabilities)
      → artefato da técnica (ex.: features.md, com [Fonte: EV-XXX])
```

### 5.1 Aprofundamento sob demanda (a síntese que dispara descoberta)

O substrato que sai da primeira varredura é **grosso** (afirmações, regras,
capacidades, termos). Alguns métodos precisam de detalhe **fino** que raramente está
lá — o exemplo canônico é o DDD tático, que desce ao nível de **atributos** de uma
entidade/objeto de valor (campos de uma classe, colunas de uma tabela). Para isso, o
CAD tem o **aprofundamento sob demanda**, sem quebrar a separação
fonte → substrato → artefato.

> **O aprofundamento é a rede — não a fonte primária.** A descoberta
> **front-carrega** as estruturas de dados (campos, exemplos, formato, relações)
> em `data-structures.md`, que o DDD tático consome direto. O aprofundamento
> sob demanda cobre só o que a descoberta **não** capturou. Quando ele precisa reler,
> resolve o caminho real da fonte compondo `sources.json[SRC].caminho` + a
> `Fonte`/`Localização` do `EV` (a coluna `SRC` do `evidence-log.md` faz esse elo). Se a
> fonte é autorizada mas o caminho composto **não existe** no workspace, **não degrada em
> silêncio**: abre backlog "confirmar caminho/base da SRC" e avisa na saída (ver a regra
> de evidência, seção 6).

**Regra de ouro: o módulo continua lendo só o substrato; quem toca a fonte é sempre a
descoberta.** Quando um `*-doc-*` de módulo esbarra numa lacuna de detalhe, o
`/cad:synthesize` não deixa o módulo ler a fonte — dispara um passo interno de
descoberta:

1. O doc-skill identifica a lacuna e o **ponteiro de evidência** que já existe
   (ex.: `EV-015 → credito/service.py L142-160`).
2. Se a fonte apontada **já está autorizada** (registrada em `sources.json`) **e** o
   módulo declara `pode_aprofundar: "fontes-autorizadas"`, o orquestrador invoca os
   skills de descoberta (`cad-doc-knowledge-base` + `cad-doc-evidence-log`) para reler
   **aquele trecho** e gravar o detalhe como **fato novo e neutro** (ex.:
   `EV-090: a classe Proposta tem os campos valor, cpf, periodo`).
3. O doc-skill relê o substrato e escreve o artefato citando `EV-090`.
4. Se o detalhe exigisse uma fonte **nova** (não em `sources.json`), ou se
   `pode_aprofundar: "nao"`, **não há releitura automática**: abre-se item de backlog
   (`consumidor: <técnica>`) para o humano escopar a fonte (`/cad:discovery`) ou
   responder (`/cad:backlog`).

Por que isso preserva a arquitetura:

- **Auditabilidade:** o atributo no artefato ainda cita um `EV`; nada entra sem
  evidência.
- **Neutralidade:** "a classe tem os campos x, y, z" é **descritivo** (substrato);
  dizer que `cpf` é um **objeto de valor** é opinião do DDD (artefato). O substrato pode
  ficar arbitrariamente detalhado sem virar DDD-flavored — e o campo extraído para o
  DDD já fica disponível para o Event Storming e os demais módulos depois.
- **Isolamento intacto:** a escrita no substrato durante o aprofundamento é feita pelos
  skills de **descoberta**, não pelo módulo. O módulo **nunca** escreve `docs/cad/`; só
  lê. Por isso não há conflito com o hook de isolamento (seção 10).
- **Controle humano preservado (princípio 6 refinado):** a releitura automática fica
  **restrita a fontes que o humano já autorizou**. Fonte nova sempre volta ao humano.

**Configuração.** `pode_aprofundar` é declarado por módulo — padrão
`"fontes-autorizadas"` para DDD e Event Storming (que descem ao detalhe) e `"nao"` para
a Lean Inception (que trabalha no nível de produto e não desce ao código). O consultor
pode forçar o modo conservador num run específico com
`/cad:synthesize <técnica> --sem-aprofundamento`. Cada aprofundamento é registrado no
`state.json` (a sessão de síntese anota quantas fontes autorizadas foram
reaprofundadas), e as evidências geradas ficam marcadas como originadas de
aprofundamento no `evidence-log.md`, para auditoria.

---

## 6. Regra de evidência (lógica aplicada por todo agente)

```
SE existe evidência rastreável (código/doc/norma) → registra com citação em evidence-log.md
SE não existe evidência clara                     → NÃO afirma, NÃO assume → cria item em backlog.md
SE há definições conflitantes entre fontes        → aplica hierarquia (princípio 4)
                                                    → registra definição priorizada + todos os conflitos
SE bloco (substrato OU técnica) validado por humano → NUNCA sobrescreve
                                                    → conflito novo = item conflito_pós_validação
SE módulo de técnica precisa de fato que não está  → ver aprofundamento (seção 5.1):
   no substrato                                       SE detalhe fino E fonte já autorizada (sources.json)
                                                         E pode_aprofundar = "fontes-autorizadas":
                                                         SE caminho (SRC.caminho + Fonte/Localização) existe
                                                          → descoberta relê o trecho apontado por um EV,
                                                            grava fato/EV novo (neutro); módulo então cita o EV
                                                         SENÃO (caminho autorizado não localizado / falta SRC)
                                                          → backlog "confirmar caminho/base da SRC" + AVISA
                                                            na saída (NÃO degrada em silêncio como "0 releituras")
                                                       SENÃO (fonte nova OU pode_aprofundar = "nao")
                                                        → cria backlog com consumidor: <técnica>
                                                          (NÃO inventa, NÃO infere, NÃO lê fonte nova sozinho)
SE humano responde item de backlog                 → fecha item, registra em evidence-log.md
                                                       com fonte "validação humana (consultor) — [data]"
```

---

## 7. Critério de parada e de quando sintetizar

Sem prioridade automática. Duas decisões ficam com o consultor, sessão a sessão:

- **Quando o substrato está "rico o bastante"** para sintetizar uma técnica — é
  julgamento do consultor. `/cad:discovery` exibe, ao final, a lista de IDs de
  backlog abertos (de descoberta) para apoiar essa decisão.
- **Quando sintetizar / o quê** — `/cad:synthesize <técnica>` valida o mínimo
  necessário do substrato para aquela técnica e, se faltar, aponta exatamente quais
  itens de backlog resolver antes (via `/cad:backlog`). O consultor decide se
  resolve o backlog primeiro ou sintetiza com lacunas explícitas marcadas como
  `[⚠️ Pendente: BL-XXX]` no artefato.

---

## 8. Schemas dos arquivos (templates)

### 8.0 Controle interno (JSON)

`.cad-plugin/state.json`
```json
{
  "sessao_atual": 3,
  "ultima_atualizacao": "2026-06-28",
  "backlog_abertos": 4,
  "historico": [
    {"sessao": 1, "data": "2026-06-20", "comando": "/cad:discovery", "foco": "credito/", "resultado": "substrato populado, 2 pendências"},
    {"sessao": 2, "data": "2026-06-22", "comando": "/cad:discovery", "foco": "normativo_credito_v3.pdf", "resultado": "3 conflitos detectados"},
    {"sessao": 3, "data": "2026-06-25", "comando": "/cad:synthesize lean-inception", "foco": "lean-inception", "resultado": "8 artefatos gerados, 5 lacunas de síntese"},
    {"sessao": 4, "data": "2026-06-26", "comando": "/cad:synthesize ddd", "foco": "ddd", "aprofundamentos": 3, "resultado": "5 artefatos; 3 fontes autorizadas reaprofundadas (atributos), 2 lacunas"}
  ]
}
```

`.cad-plugin/sources.json`
```json
{
  "fontes": [
    {"id": "SRC-001", "caminho": "credito/", "tipo": "Código", "sessao": 1, "data": "2026-06-20"},
    {"id": "SRC-002", "caminho": "normativo_credito_v3.pdf", "tipo": "Normativo", "sessao": 2, "data": "2026-06-22"}
  ]
}
```
Tipos válidos: `Normativo`, `Corporativo`, `Código`, `Informal`. Uma mesma fonte
pode aparecer em múltiplas sessões se revisitada explicitamente. O `caminho` é a
**base** a partir da qual o aprofundamento sob demanda (seção 5.1) resolve o arquivo
real de um `EV`: `caminho` + a `Fonte`/`Localização` do `EV` (via a coluna `SRC` do
`evidence-log.md`). Por isso a `Fonte` no `evidence-log` é registrada **relativa** ao
`caminho` da sua `SRC`.

---

### 8.1 Templates dos artefatos de `docs/` — vivem nos skills

Os schemas dos artefatos entregues em `docs/` **não são reproduzidos aqui**. Cada
template canônico vive no `SKILL.md` do skill que o gera — **fonte única**, para o skill
ser autossuficiente em runtime (não depende deste documento). Este documento descreve o
*porquê*; o *o quê/como* de cada arquivo está no skill correspondente:

| Pasta | Técnica | Templates canônicos em |
|---|---|---|
| `docs/cad/` | substrato neutro | `skills/cad-doc-*/SKILL.md` — knowledge-base, evidence-log, vocabulary, business-rules, capabilities, data-structures, backlog |
| `docs/lean-inception/` | Lean Inception | `skills/lean-inception-doc-*/SKILL.md` |
| `docs/ddd/` | DDD | `skills/ddd-doc-*/SKILL.md` |
| `docs/event-storming/` | Event Storming | `skills/event-storming-doc-*/SKILL.md` |

Invariantes transversais que valem para **todos** esses templates (o que importa ao
design, independentemente do formato de cada arquivo):

- Todo bloco factual carrega `[Fonte: EV-XXX]` ou `[⚠️ Pendente: BL-XXX]` (princípios
  1 e 11).
- O `evidence-log.md` tem a coluna `SRC`, que liga cada `EV` à fonte de `sources.json`
  — a base do aprofundamento sob demanda (seção 5.1) para resolver o caminho real.
- O `backlog.md` tem a coluna `consumidor` (`cad` ou o nome da técnica), separando
  lacunas de descoberta das de síntese.

---

## 9. Decisões de design

As decisões estruturais que sustentam o resto do documento (o *porquê* de cada escolha):

1. **Reposicionamento:** o plugin é o **CAD** (metodologia de descoberta), e a Lean
   Inception é o **primeiro consumidor**, não o teto da proposta.
2. **Três comandos:** `/cad:discovery`, `/cad:synthesize <técnica>`, `/cad:backlog`.
3. **Substrato neutro × módulos de técnica:** `docs/cad/` guarda conhecimento
   descritivo; `docs/<técnica>/` guarda artefatos opinativos de um método só.
4. **Isolamento por técnica** é princípio não-negociável (princípio 3),
   reforçado por hook: módulo lê só o substrato, escreve só na própria pasta, e tem
   `vocabulario_proibido` de outras técnicas.
5. **Contrato de módulo (seção 5):** manifesto fixo declarando entradas, saída,
   artefatos e vocabulário proibido — permite plugar DDD/Event Storming/etc. sem
   tocar no núcleo.
6. **Templates da Lean Inception revisados para fidelidade ao livro de Caroli** —
   Visão (Geoffrey Moore), ENFN, Objetivos, Personas, Funcionalidades
   (semáforo + tabela E/\$/♥), Jornadas, Sequenciador (6 regras + amostragem de
   esforço/custo) e Canvas MVP (7 blocos).
7. **Removidos da Lean Inception por não pertencerem ao método:**
   `glossary.md` com *bounded context*/linguagem ubíqua (→ substrato neutro
   `vocabulary.md` + futuro módulo DDD); `stakeholders.md` interesse×influência (→
   candidato a módulo próprio); `prioritization.md` MoSCoW (→ substituído por
   Sequenciador + semáforo/tabela); `roadmap.md` Now/Next/Later (→ substituído por
   ondas do Sequenciador + incrementos de MVP; roadmap genérico vira consumidor
   próprio se desejado).
8. **Substrato ganha dois inventários neutros** explicitados pelos insights:
   `business-rules.md` e `capabilities.md` — a ponte natural para DDD e Business
   Capability Mapping.
9. **Granularidade de skill** passa de "1 por arquivo" para "1 por grupo coeso de
   artefatos da mesma atividade do método" (ex.: `lean-inception-doc-product-framing`).
10. **Backlog ganha coluna `consumidor`** (`cad` ou nome da técnica), separando
    lacunas de descoberta de lacunas de síntese.
11. **Controle interno** segue em JSON oculto (`.cad-plugin/state.json`,
    `sources.json`); `docs/` segue em Markdown.
12. **Proteção de validação humana** vale tanto para o substrato quanto para os
    artefatos de técnica.
13. **Módulo DDD totalmente especificado** como segundo módulo plugado —
    `subdomains.md` (Core/Supporting/Generic), `bounded-contexts.md`
    (com mapeamento a módulos de código e acoplamento), `ubiquitous-language.md`
    (linguagem ubíqua por contexto, consumindo `vocabulary.md`), `context-map.md`
    (padrões ACL/OHS/Shared Kernel/…) e `aggregates.md` (agregados, entidades, VOs,
    eventos de domínio, invariantes consumindo `business-rules.md`). Prova o contrato
    da seção 5 com dois métodos sobre o mesmo substrato, sem mistura.
14. **Convenção de nomenclatura única (seção 3.0):** todo identificador de
    skill, pasta, argumento de comando e marcação de backlog deriva do **nome
    programático** da técnica (`lean-inception`, `ddd`, `cad`). Elimina o ambíguo
    `lean-module`, que vira `lean-inception-module`; nome completo/exibição ficam só
    em prosa e no campo `metodo_de_origem`.
15. **Toolchain em Node.js + TypeScript (seção 11):** ESM, `esbuild`, versão de
    fonte única no `package.json` e build em `.mjs` — escolhido por portabilidade
    (Windows/macOS/Linux), JSON nativo e zero dependências em runtime. O CAD **não tem
    servidor MCP** (lê o repositório do cliente com ferramentas nativas), então não
    inclui SDK de MCP, cliente HTTP, empacotamento `.mcpb` nem `mcpServers`; compila só
    **hooks + helpers**. O contrato de módulo é formalizado como `module.json` (JSON),
    parseável pelos hooks sem dependência.
16. **Repositório e nome de pacote:** repositório `CAD-Claude-Plugin`,
    pacote/manifesto e artefato `cad-claude-plugin` (e `cad-claude-plugin.plugin`).
    Identificadores de plataforma (`/cad:`, skills `cad-*`,
    controle `.cad-plugin/`) permanecem, pois derivam do nome programático `cad`.
17. **Módulo Event Storming totalmente especificado** como terceiro
    módulo plugado: `timeline.md` (eventos de domínio + eventos-pivô), `flows.md`
    (ator→comando→agregado→evento→read model→política), `hotspots.md` (conflitos/dúvidas
    vindos do `backlog.md`/`evidence-log.md`) e `boundaries.md` (contextos candidatos +
    sistemas externos). Formaliza que o `vocabulario_proibido` distingue termos
    **compartilhados** (não barrados entre técnicas complementares como ES e DDD) de
    **exclusivos** (barrados) — ver nota na seção 5.
18. **Aprofundamento sob demanda (seção 5.1):** a síntese pode reler **fontes já
    autorizadas** (em `sources.json`), apontadas por um `EV`, para extrair detalhe fino
    (ex.: atributos de um agregado no DDD), gravando o detalhe como **fato neutro** via
    os skills de descoberta — o módulo continua só lendo o substrato. Fonte **nova**
    sempre volta ao humano (backlog). Contrato ganha `pode_aprofundar` (`"nao"` na Lean;
    `"fontes-autorizadas"` em DDD e Event Storming); princípio 6 refinado; flag
    `--sem-aprofundamento` para o modo conservador.
19. **Estruturas de dados no substrato:** novo artefato
    `data-structures.md` e skill `cad-doc-data-structures` — a descoberta front-carrega
    as estruturas de dados (campos, valores enumerados, **exemplos de preenchimento**,
    **formato/tamanho derivado** e **relações com multiplicidade**) em nível
    conceitual/lógico e **neutro** (sem tipos técnicos, tabelas, FKs; exemplos nunca de
    PII). Vira **fonte primária** dos atributos/relações no DDD tático, com o
    aprofundamento sob demanda como **rede**. Correção associada: `evidence-log.md` ganha
    a coluna **`SRC`** (elo `EV`→`sources.json`) e o `/cad:synthesize` trata o caso
    **"fonte autorizada, caminho não localizado"** sem degradar em silêncio.

---

## 10. Hooks (enforcement determinístico)

Em `hooks/hooks.json`, carregados quando o plugin está habilitado. Os três hooks são
TypeScript (`src/hooks/*.ts`) compilados para `.cjs` autossuficientes (ver seção 11)
e referenciados como `node ${CLAUDE_PLUGIN_ROOT}/build/hooks/<hook>.cjs`. Não têm
dependência em runtime — usam só a stdlib do Node e `JSON.parse` nativo (inclusive
para ler o `module.json` de cada técnica).

| Hook | Evento | Função |
|---|---|---|
| **Validação de evidência** | `PostToolUse`, matcher `Write\|Edit` | **Dois modos.** Em `docs/cad/**/*.md` (vault): exige frontmatter YAML e, nas notas de conhecimento (01–10), um `source:` não-vazio — isentas as pastas de navegação/backlog `11 Investigations`, `12 Views` e `13 MOCs`. Em `docs/<técnica>/*.md` (módulos legados, um nível): mantém o cheque inline `[Fonte: EV-XXX]`/`[⚠️ Pendente: BL-XXX]`. Bloqueia (exit 2) com o motivo — reforça o princípio 1. |
| **Proteção de validação humana** | `PreToolUse`, matcher `Write\|Edit`, filtrado a `docs/**/*.md` | Bloqueia remoção/sobrescrita de nota/bloco com origem "validação humana" (frase de fonte ou `status: validated` no frontmatter) fora de `/cad:backlog` (`CAD_BACKLOG_FLOW=1`) — reforça o princípio 7. |
| **Isolamento por técnica** | `PreToolUse`, matcher `Write\|Edit` | Lê o `module.json` do módulo em execução e bloqueia se: (a) a escrita for fora de `pasta_saida`; ou (b) o conteúdo contiver algum termo de `vocabulario_proibido` — reforça o princípio 3 (não-misturar técnicas). |

> **Aprofundamento e o hook de isolamento.** No aprofundamento sob demanda (seção 5.1),
> a escrita no substrato (`docs/cad/`) é feita pelos skills de **descoberta**
> (`cad-doc-*`), não pelo módulo — logo, não dispara o bloqueio "fora de `pasta_saida`".
> O módulo continua escrevendo só em `docs/<técnica>/`. Se algum dia um skill de módulo
> tentar escrever no substrato, o hook **deve** bloquear: é exatamente a violação que
> ele existe para impedir.

---

## 11. Linguagem, build, empacotamento e versionamento

O plugin é escrito em **Node.js + TypeScript**. A escolha se justifica por mérito
próprio: **portável** nos três sistemas (Windows/macOS/Linux), **JSON nativo** (ideal
para `state.json`/`sources.json`, leitura de `module.json` e validação de evidência) e
um único ecossistema de build. Característica que mantém a pegada pequena: o CAD **não
tem servidor MCP** — não acessa API externa, lê o repositório do cliente com as
ferramentas nativas do Claude Code. O que se compila são apenas **hooks** e
**helpers**.

### 11.1 Convenções de linguagem e build

- **Node.js + TypeScript, ESM** (`"type": "module"`); `tsconfig` com `target ES2022`,
  `module Node16`, `strict`, `rootDir src` → `outDir build`.
- **`esbuild`** para gerar artefatos **autossuficientes** (deps inlined), de modo a
  distribuir o plugin **sem `node_modules` e sem `npm install` no destino**.
- **Versão de fonte única** no `package.json`, injetada em build via
  `define: { __PKG_VERSION__: ... }` e **espelhada** no `.claude-plugin/plugin.json`.
- **Scripts de build em `.mjs`** node-nativos; `package.mjs` zipa o `.plugin` para
  "Fazer upload de plugin local" (Code, Cowork e Chat).
- **`engines.node >= 22`** para desenvolvimento; artefatos compilados com
  `target: node18`; **pré-requisito de runtime: Node 18+** na máquina do consultor.
  (Atenção: o instalador nativo do Claude Code traz runtime próprio e **não** instala
  Node — então Node 18+ deve ser documentado como pré-requisito do plugin.)
- Plataformas `darwin`/`win32`/`linux`; `build/` no `.gitignore`.

### 11.2 Por que não há servidor MCP (escopo mínimo de runtime)

Plugins que integram APIs externas costumam embutir um **servidor MCP** (com o SDK do
MCP e um cliente HTTP) empacotado como bundle MCP (`.mcpb`). **O CAD não precisa
disso**: toda a leitura de fontes acontece via ferramentas nativas do Claude Code sobre
o repositório do cliente. Logo, o CAD **não inclui** SDK de MCP, cliente HTTP, passo de
empacotamento `.mcpb`, nem injeção de `mcpServers` no `plugin.json`. Restam, para
compilar, apenas os **hooks** e os **helpers** — sem dependências em runtime.

### 11.3 Estrutura de engenharia

```
cad-claude-plugin/
├── .claude-plugin/plugin.json     # manifesto Claude Code (espelha a versão)
├── package.json                   # fonte única da versão; scripts; devDeps
├── tsconfig.json                  # ES2022 / Node16 / strict / src→build
├── build.mjs                      # esbuild: src/ → build/*.cjs autossuficientes
├── package.mjs                    # zipa o .plugin (sem .mcpb)
├── hooks/hooks.json               # referencia build/hooks/*.cjs via ${CLAUDE_PLUGIN_ROOT}
├── src/
│   ├── hooks/
│   │   ├── validate-evidence.ts
│   │   ├── protect-human-validation.ts
│   │   └── technique-isolation.ts
│   └── lib/
│       ├── state.ts               # append determinístico em state.json/sources.json
│       └── manifest.ts            # leitura de module.json (JSON nativo, sem deps)
├── skills/ …                       # Markdown (+ module.json por *-module/)
└── README.md
```

### 11.4 Dependências e scripts

Sem dependências de runtime. `devDependencies`: `esbuild`, `tsx`, `typescript`,
`@types/node`, `adm-zip` (empacotamento). Scripts propostos:

| Script | Ação |
|---|---|
| `build` | `node build.mjs` — esbuild de `src/` para `build/*.cjs` |
| `typecheck` | `tsc --noEmit` |
| `package` | `npm run build && node package.mjs` — gera `build/cad-claude-plugin.plugin` |
| `dev:hook` | `tsx src/hooks/<hook>.ts` — executa um hook localmente sobre um caso de teste |
| `prepare` | `npm run build` |

### 11.5 Versão e proveniência

A versão vive no `package.json` (fonte única), é espelhada no `plugin.json` e
**injetada nos helpers via `__PKG_VERSION__`**. Assim, o helper que escreve o
`state.json` pode **carimbar a versão do plugin que gerou cada sessão** — um ganho de
auditabilidade coerente com os princípios do CAD (rastreabilidade ponta a ponta):

```json
{ "sessao_atual": 3, "plugin_versao": "0.1.0", "historico": [ ... ] }
```

---

## 12. Roadmap de consumidores (módulos futuros, fora do escopo de implementação)

Cada um é uma pasta nova em `docs/` + um módulo novo no plugin, sob o contrato da
seção 5, consumindo o mesmo substrato neutro:

> O **DDD** e o **Event Storming** **não** estão nesta lista —
> já são módulos plugados e totalmente especificados.

- **Impact Mapping** (`docs/impact-mapping/`) — objetivos, atores, impactos,
  entregáveis, inferidos das evidências.
- **User Story Mapping** (`docs/user-story-mapping/`) — jornadas reais
  reconstruídas a partir de logs e processos.
- **Wardley Mapping** (`docs/wardley/`) — capacidades posicionadas por maturidade e
  diferenciação (consome `capabilities.md`).
- **Business Capability Mapping** (`docs/bcm/`) — capacidades organizadas em mapa
  hierárquico/heat map (consome `capabilities.md`).
- **Value Stream Mapping** (`docs/vsm/`) — fluxos reconstruídos a partir de
  processos e integrações.
- **Análise de stakeholders** (`docs/stakeholders/`) — mapa interesse × influência,
  como técnica própria (não é artefato da Lean Inception).

---

## 13. Próximos passos sugeridos

- Detalhar o conteúdo exato de cada `SKILL.md` (instruções do agente por comando e
  por documento), começando pelos 3 orquestradores e pelos módulos Lean, DDD e Event
  Storming.
- Definir o formato de citação de paráfrase (limite de palavras, estilo) para o
  `evidence-log`, evitando reprodução literal de documentos normativos/corporativos
  protegidos.
- Especificar o **mínimo necessário do substrato** que `/cad:synthesize <técnica>`
  exige antes de gerar cada artefato (ex.: Lean `mvp-canvas.md` exige objetivos,
  personas, jornadas e sequenciador; DDD `aggregates.md` exige `business-rules.md` e
  `bounded-contexts.md`; Event Storming `flows.md` exige `timeline.md` e as regras de
  negócio das políticas).
- Definir como o DDD lida com **conflitos do `vocabulary.md` que viram dois
  significados legítimos** (um por contexto) em `ubiquitous-language.md` — quando é
  fronteira de contexto e quando é divergência a resolver via `/cad:backlog`.
- Detalhar a **derivação hotspots ← backlog/evidence-log** do Event Storming: quais
  tipos de item de backlog viram hotspot e como o hotspot referencia sua origem.
- Implementar os 3 hooks da seção 10 (`hooks/hooks.json`), incluindo o
  `vocabulario_proibido` (com a distinção compartilhado × exclusivo da seção 5), no
  toolchain da seção 11 (TypeScript em `src/hooks/`, compilado por `esbuild` para
  `build/hooks/*.cjs`).
- Prototipar o ciclo completo (`/cad:discovery` → `/cad:synthesize lean-inception` →
  `/cad:synthesize ddd` → `/cad:synthesize event-storming` → `/cad:backlog`) num
  repositório piloto pequeno, validando o apêndice incremental, a proteção de blocos
  validados e o isolamento por técnica **entre três módulos**.
- Especificar o **quarto módulo (Impact Mapping)** como próxima prova do contrato.