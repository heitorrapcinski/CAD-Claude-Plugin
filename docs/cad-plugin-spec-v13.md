---
documento: Especificação de Estratégia
projeto: Plugin Claude Code/Cowork — Collaborative Augmented Discovery (CAD)
versao: 13.5
data: 2026-06-28
status: aberto para revisão
substitui: v13.4 (CAD + módulos Lean/DDD, toolchain autônomo)
---

# Plugin Claude Code/Cowork — Collaborative Augmented Discovery (CAD)

## 0.6. O que mudou da v13.4 para a v13.5 (resumo executivo)

Correção: os exemplos de `module.json` na seção 5 estavam em YAML "por legibilidade",
o que era inconsistente com um arquivo `.json`. Agora estão em **JSON de verdade** — o
formato que os hooks leem com `JSON.parse` nativo (sem dependência de parser, coerente
com "zero dependências em runtime" da seção 11 e com o princípio 9, "controle em
JSON"). Sem mudança de campos nem de decisão.

## 0.5. O que mudou da v13.3 para a v13.4 (resumo executivo)

Edição: a seção 11 e o histórico foram reescritos para descrever o toolchain de forma
**autônoma**, por mérito técnico próprio, sem referência a outros projetos. Sem
mudança de decisão.

## 0.4. O que mudou da v13.2 para a v13.3 (resumo executivo)

Definição do nome de repositório e de pacote: o repositório é **`CAD-Claude-Plugin`** e
o nome do pacote/manifesto e do artefato `.plugin` passam de `cad-plugin` para
**`cad-claude-plugin`** (que ainda segue a regra `cad-<adição>` da seção 3.0). Os
identificadores de **plataforma não mudam**: comandos `/cad:`, skills `cad-*` e a pasta
de controle `.cad-plugin/` continuam derivando do nome programático `cad`.

## 0.3. O que mudou da v13.1 para a v13.2 (resumo executivo)

Padronização da **linguagem e do toolchain de build** (nova seção 11): **Node.js +
TypeScript**, ESM, `esbuild`, versão de fonte única no `package.json` e scripts de
build em `.mjs`. A característica estrutural é que o CAD **não tem servidor MCP** (não
acessa API externa — lê o repositório do cliente com as ferramentas nativas do Claude
Code); o que se compila são os **3 hooks** e **helpers determinísticos** (append de
`state.json`/`sources.json`, leitura de `module.json`), todos com a stdlib do Node e
`JSON.parse` nativo — **zero dependências em runtime**. Também se formaliza o contrato
de módulo como `module.json` (JSON), parseável pelos hooks sem dependência.

## 0.2. O que mudou da v13.0 para a v13.1 (resumo executivo)

Padronização de nomenclatura, para eliminar a ambiguidade do antigo `lean-module`.
A regra agora é única e explícita (seção 3.0): **o prefixo de toda skill é o nome
programático da técnica**. Logo `lean-module` → `lean-inception-module`, e os docs
Lean `lean-doc-*` → `lean-inception-doc-*`. Os skills de DDD já seguiam o padrão
(`ddd-module`, `ddd-doc-*`). O argumento do comando também passa a usar o nome
programático: `/cad:synthesize lean-inception` (não `/cad:synthesize lean`). Nenhuma
mudança estrutural — só nomes.

## 0.1. O que mudou da v12 para a v13 (resumo executivo)

A v12 estabeleceu o reposicionamento (CAD como plataforma), o **contrato de módulo
de técnica** (seção 5) e a Lean Inception como **primeiro** módulo, deixando o DDD
como consumidor futuro.

A v13 **especifica o módulo DDD por completo** — manifesto, skills e templates fiéis
a Eric Evans — como **segundo módulo plugado**. Isso valida o contrato na prática:
dois métodos consomem o mesmo substrato neutro sem se misturarem. Em particular:

- A ponte que os insights apontaram fica concreta: o substrato neutro
  (`vocabulary.md`, `business-rules.md`, `capabilities.md`) alimenta diretamente os
  artefatos DDD (linguagem ubíqua, bounded contexts, agregados).
- O DDD passa a ter `vocabulario_proibido` simétrico ao da Lean: termos de Lean
  (MVP, persona, jornada, sequenciador…) ficam barrados nos artefatos DDD, e
  vice-versa — garantindo o não-misturar que motivou a v12.
- O DDD sai da seção 11 (consumidores futuros) e ganha schemas próprios (seção 8.3).

Mudanças menores: contagem de skills atualizada (corrige também uma soma da v12) e
o "próximo módulo de prova de contrato" passa a ser o Event Storming.

## 0. O que mudou da v11 para a v12 (resumo executivo)

A v11 tratava o plugin como uma **evolução da Lean Inception**. Os insights de
executar a primeira versão mostraram que a parte mais valiosa — escanear fontes,
extrair fatos, detectar divergências e validar com especialistas — **não pertence
à Lean Inception**. Ela é uma etapa de descoberta que pode alimentar *vários*
métodos.

A v12 reposiciona o plugin assim:

> **Collaborative Augmented Discovery (CAD)** é uma metodologia de descoberta
> colaborativa humano-agente que produz uma **base de conhecimento auditável e
> orientada por evidências**, capaz de apoiar diferentes práticas de engenharia de
> software. A **Lean Inception passa a ser um dos consumidores** desse
> conhecimento — o primeiro a ser implementado e validado. DDD, Event Storming,
> Impact Mapping e outros são consumidores futuros, sob o mesmo contrato.

Três mudanças estruturais derivam disso:

1. **Separação substrato × método.** O CAD produz um **substrato neutro**
   (`docs/cad/`): conhecimento descritivo, sem opinião metodológica. Cada **módulo
   de técnica** (`docs/lean-inception/`, `docs/ddd/`, …) consome esse substrato e
   gera **apenas os artefatos da sua técnica**, fiéis ao método de origem.

2. **Isolamento por técnica (não-misturar).** Um módulo nunca lê nem escreve a
   pasta de outra técnica. A fronteira de pasta + skill garante que Lean Inception
   não vaze conceitos de DDD e vice-versa. Isso é o que você pediu: cada pasta de
   `docs/` contém artefatos de uma técnica só.

3. **Templates da Lean Inception revisados para fidelidade ao livro de Paulo
   Caroli.** A v11 havia misturado, dentro das "canvases da Lean Inception",
   artefatos que **não são** da Lean Inception:
   - `glossary.md` com *bounded context* e *linguagem ubíqua* → conceitos de **DDD**.
   - `stakeholders.md` (mapa interesse × influência) → técnica de **análise de
     stakeholders**, não da Lean Inception (que só distingue "stakeholder × membro
     ativo" para a agenda do workshop).
   - `prioritization.md` com **MoSCoW** → a Lean Inception prioriza pelo
     **Sequenciador** + **gráfico do semáforo** + **tabela esforço/negócio/UX**, não
     por MoSCoW.
   - `roadmap.md` com **Now/Next/Later** → convenção genérica de roadmap, não um
     artefato de Caroli (que usa **ondas do Sequenciador** e **incrementos de MVP**).

   Esses quatro itens saem da Lean Inception. O glossário/linguagem ubíqua migra
   (em parte) para o substrato neutro e (em parte) para o futuro módulo DDD; os
   demais viram candidatos a módulos próprios (seção 11). No lugar, a Lean
   Inception recebe os artefatos **fiéis** ao livro (seção 8.2).

---

## 1. Visão geral

Plugin instalável no Claude Code/Cowork que atua como **co-facilitador de
descoberta aumentada (CAD)** para consultores entrando em sistemas e organizações
já existentes, e que depois **sintetiza** esse conhecimento em artefatos fiéis a
métodos específicos — a começar pela Lean Inception (método de Paulo Caroli).

Três comandos cobrem o ciclo:

- **`/cad:discovery [fontes]`** — escaneia exatamente as fontes indicadas pelo
  consultor (código, documentação, normativos), e popula/atualiza o **substrato
  neutro** (`docs/cad/`): conhecimento, evidências, vocabulário, regras de negócio
  e capacidades. Tudo que não encontra vira backlog.
- **`/cad:synthesize <técnica> [escopo]`** — roda um **módulo de técnica**: lê o
  substrato neutro e gera/atualiza **apenas** os artefatos daquela técnica em
  `docs/<técnica>/`. Ex.: `/cad:synthesize lean-inception`. Lacunas específicas da técnica
  vão para o backlog, marcadas com o consumidor de origem.
- **`/cad:backlog [id...]`** — apresenta as pendências (lacunas de conhecimento e
  conflitos de definição) em formulário ao consultor, resolve, grava a resposta
  como evidência de "Validação Humana" e atualiza os documentos afetados (do
  substrato e/ou dos módulos). Aceita lista explícita de IDs; sem argumento, lista
  todas as pendências abertas.

Uso previsto: consultor individual, conduzindo sessões com cliente ao longo de
múltiplos dias/semanas.

---

## 2. Princípios fundamentais (não-negociáveis)

1. **Sem evidência, sem afirmação.** Nenhum agente registra um fato sem fonte
   rastreável. Lacunas vão para o backlog, nunca são preenchidas por inferência
   silenciosa.
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
6. **Escopo de scan é sempre humano.** `/cad:discovery` trabalha só nas fontes
   passadas explicitamente. Nunca rescaneia sozinho fontes de sessões anteriores.
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
11. **Rastreabilidade embutida no próprio arquivo.** Qualquer `.md`, aberto
    isoladamente, mostra de onde vêm seus fatos (`[Fonte: EV-XXX]`) ou que está
    pendente (`[⚠️ Pendente: BL-XXX]`).

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
│   └── plugin.json                               # manifesto: name, version, description
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
│   ├── cad-doc-knowledge-base/                   # ── substrato neutro ──
│   │   └── SKILL.md
│   ├── cad-doc-evidence-log/
│   │   └── SKILL.md
│   ├── cad-doc-vocabulary/                       # termos + conflitos (SEM bounded context)
│   │   └── SKILL.md
│   ├── cad-doc-business-rules/                   # regras de negócio extraídas
│   │   └── SKILL.md
│   ├── cad-doc-capabilities/                     # inventário de capacidades
│   │   └── SKILL.md
│   ├── cad-doc-backlog/
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
│   └── ddd-doc-tactical/                         # agregados, entidades, VOs, eventos, repositórios
│       └── SKILL.md
└── README.md
```

Total v13: **20 skills** = 3 orquestradores + 6 do substrato CAD + módulo Lean (1
manifesto + 6 docs) + módulo DDD (1 manifesto + 3 docs). Cada módulo de técnica
futuro (Event Storming, Impact Mapping…) adiciona 1 manifesto + N skills de
documento, sob o mesmo contrato (seção 5), sem tocar no núcleo.

> **Correção vs v12.** A v12 somava 15 skills, mas listava 6 skills de documento
> Lean (não 5); o total correto da v12 era 16. A v13 (16 + módulo DDD com 4) chega a
> 20.

> **Nota sobre granularidade de skill (mudança vs v11).** Em vez de "1 skill por
> arquivo", a v12 adota "**1 skill por grupo coeso de artefatos da mesma atividade
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
├── Template        → schema fixo (seção 8), fiel ao método de origem
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
  cad/                          # ── SUBSTRATO NEUTRO (independente de técnica) ──
    knowledge-base.md           → fatos extraídos, organizados por domínio
    evidence-log.md             → tabela de evidências rastreáveis
    vocabulary.md               → termos + definições por fonte + conflitos
    business-rules.md           → regras de negócio extraídas, com evidência
    capabilities.md             → inventário de capacidades de negócio/sistema
    backlog.md                  → lacunas e conflitos pendentes de validação

  lean-inception/               # ── TÉCNICA: Lean Inception (fiel a Caroli) ──
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

  # event-storming/ , impact-mapping/ , ...  (consumidores futuros, seção 11)
```

Cada técnica nova é uma pasta nova; o substrato `docs/cad/` é compartilhado por
todas. **Nunca** há conceito de uma técnica dentro da pasta de outra.

---

## 4. Comandos

| Comando | Função |
|---|---|
| `/cad:discovery [fontes]` | Registra as fontes em `sources.json` → escaneia apenas elas → invoca `cad-doc-knowledge-base`, `cad-doc-evidence-log`, `cad-doc-vocabulary`, `cad-doc-business-rules`, `cad-doc-capabilities` para popular/atualizar o substrato neutro → invoca `cad-doc-backlog` para registrar lacunas/conflitos. **Não gera nenhum artefato de técnica.** Respeita a proteção de blocos validados por humano (princípio 7). |
| `/cad:synthesize <técnica> [escopo]` | Carrega o manifesto do módulo da técnica (ex.: `lean-inception-module`) → valida que o substrato tem o mínimo necessário (senão sugere `/cad:discovery` ou aponta o backlog) → invoca os skills de documento daquele módulo, que **leem só de `docs/cad/`** e escrevem **só em `docs/<técnica>/`** → registra lacunas específicas da técnica no backlog, marcadas com `consumidor: <técnica>`. |
| `/cad:backlog [id...]` | Invoca `cad-doc-backlog` para listar pendências, filtradas por IDs (`BL-003 BL-007`) quando informados; sem argumento, lista todas abertas → formulário de perguntas → grava resposta como evidência "Validação Humana" via `cad-doc-evidence-log` → atualiza o(s) documento(s) afetado(s), seja no substrato (`docs/cad/`) ou no módulo da técnica indicada no item. |

Não há comando separado para vocabulário/glossário ou relatório de cobertura:
conflito de definição é um tipo de item de backlog; o status de cobertura é saída
de `/cad:discovery` e de `/cad:synthesize` ao final de cada execução.

---

## 5. Contrato de módulo de técnica (o núcleo da v12)

Este contrato é o que permite plugar DDD, Event Storming, Impact Mapping etc. sem
tocar no núcleo, e o que garante que nenhuma técnica contamine outra.

Um **módulo de técnica** é uma família de skills com um **manifesto** em duas faces:
`<x>-module/SKILL.md` (legível por humano, em prosa) e `<x>-module/module.json` (o
**contrato enforceável**, em JSON, lido pelos hooks e pelo `cad-synthesize` com
`JSON.parse` nativo — sem dependência). Campos do contrato: `tecnica` (nome
programático), `metodo_de_origem` (nome completo, só para prosa), `pasta_saida` (única
pasta onde o módulo escreve), `entradas_substrato` (únicas fontes que o módulo lê),
`artefatos` (o que o módulo produz) e `vocabulario_proibido` (termos de outras técnicas
barrados nestes artefatos). O `module.json` do módulo Lean Inception:

```json
{
  "tecnica": "lean-inception",
  "metodo_de_origem": "Lean Inception (Paulo Caroli)",
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
simétrico (barra termos da Lean) e que as `entradas_substrato` privilegiam os três
documentos que os insights apontaram como ponte: `vocabulary`, `business-rules` e
`capabilities` (respectivamente: linguagem ubíqua por contexto, invariantes dos
agregados, e subdomínios/bounded contexts):

```json
{
  "tecnica": "ddd",
  "metodo_de_origem": "Domain-Driven Design (Eric Evans)",
  "pasta_saida": "docs/ddd/",
  "entradas_substrato": [
    "docs/cad/knowledge-base.md",
    "docs/cad/evidence-log.md",
    "docs/cad/vocabulary.md",
    "docs/cad/business-rules.md",
    "docs/cad/capabilities.md"
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
    "é-não é-faz-não faz"
  ]
}
```

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

---

## 6. Regra de evidência (lógica aplicada por todo agente)

```
SE existe evidência rastreável (código/doc/norma) → registra com citação em evidence-log.md
SE não existe evidência clara                     → NÃO afirma, NÃO assume → cria item em backlog.md
SE há definições conflitantes entre fontes        → aplica hierarquia (princípio 4)
                                                    → registra definição priorizada + todos os conflitos
SE bloco (substrato OU técnica) validado por humano → NUNCA sobrescreve
                                                    → conflito novo = item conflito_pós_validação
SE módulo de técnica precisa de fato que não está  → cria backlog com consumidor: <técnica>
   no substrato                                       (NÃO inventa, NÃO infere)
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
    {"sessao": 3, "data": "2026-06-25", "comando": "/cad:synthesize lean-inception", "foco": "lean-inception", "resultado": "8 artefatos gerados, 5 lacunas de síntese"}
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
pode aparecer em múltiplas sessões se revisitada explicitamente.

---

### 8.1 Substrato neutro (`docs/cad/`)

`docs/cad/knowledge-base.md`
```markdown
# Base de Conhecimento — [Domínio]

## [Subdomínio: ex. Aprovação de Crédito]
- **Afirmação:** [paráfrase, nunca cópia literal da fonte]
  - Status: confirmado | inferido | conflitante
  - Evidência: → evidence-log.md#EV-014
  - Sessão: 2
```

`docs/cad/evidence-log.md`
```markdown
# Log de Evidências

| ID | Afirmação (resumo) | Fonte | Localização | Tipo de fonte | Sessão | Data |
|---|---|---|---|---|---|---|
| EV-014 | Aprovação exige 2 alçadas | normativo_credito_v3.pdf | Seção 4.2 | Normativo | 2 | 2026-06-22 |
| EV-015 | Código implementa 1 alçada | credito/service.py | L142-160 | Código | 1 | 2026-06-20 |
```
Tipos de fonte: `Normativo`, `Corporativo`, `Código`, `Informal`, `Validação Humana`.

`docs/cad/vocabulary.md` — termos + conflitos, **neutro** (sem *bounded context*,
que é um recorte do DDD e vive no módulo `ddd/`):
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
> O campo `Contexto (bounded context)` da v11 foi **removido daqui** — pertence ao
> módulo DDD, que produz `ubiquitous-language.md` com a linguagem ubíqua por
> contexto, consumindo este vocabulário neutro.

`docs/cad/business-rules.md` — regras extraídas (neutras; o DDD/BCM as consomem):
```markdown
# Regras de Negócio Extraídas

| ID | Regra (paráfrase) | Condição/Gatilho | Fonte | Status | Evidência |
|---|---|---|---|---|---|
| BR-007 | Limite de crédito acima de X exige 2ª alçada | valor > R$ 50k | normativo | confirmado | → EV-014 |
| BR-008 | Cliente inadimplente não recebe nova proposta | flag em cadastro | código | conflitante | → EV-031 |
```

`docs/cad/capabilities.md` — inventário **plano** de capacidades (o mapa
hierárquico/heat map é técnica própria — BCM; aqui é só descoberta):
```markdown
# Inventário de Capacidades

| ID | Capacidade | Tipo | Evidência | Observações |
|---|---|---|---|---|
| CAP-003 | Análise de risco de crédito | negócio | → EV-040 | parcialmente automatizada |
| CAP-004 | Notificação ao cliente | sistema | → EV-041 | via fila SQS |
```

`docs/cad/backlog.md` — agora com coluna de **consumidor** (substrato ou técnica):
```markdown
# Backlog de Pendências

| ID | Tipo | Consumidor | Lacuna/Conflito | Artefato afetado | Status | Resposta | Fonte resposta | Data |
|---|---|---|---|---|---|---|---|---|
| BL-003 | lacuna | cad | Quais permissões da capacidade "Aprovação"? | capabilities.md | aberto | — | — | — |
| BL-004 | conflito_definição | cad | "Aprovação": normativo 2 alçadas vs. código 1 | vocabulary.md | aberto | — | — | — |
| BL-009 | lacuna | lean-inception | Falta a proposta do MVP1 | lean-inception/mvp-canvas.md | aberto | — | — | — |
```
Tipos: `lacuna`, `conflito_definição`, `conflito_pós_validação`. Consumidor: `cad`
ou o nome da técnica (`lean-inception`, `ddd`, …).

---

### 8.2 Módulo Lean Inception (`docs/lean-inception/`) — fiel a Caroli

Os oito artefatos abaixo correspondem **exatamente** às atividades do livro *Lean
Inception: Como Alinhar Pessoas e Construir o Produto Certo* (Caroli). Todo bloco
factual referencia uma evidência do substrato (`[Fonte: EV-XXX]`) ou marca pendência.

**`vision.md`** — Visão do Produto (template de Geoffrey Moore):
```markdown
# Visão do Produto — [Nome]

Para [cliente final] [Fonte: EV-XXX]
cujo [problema que precisa ser resolvido] [Fonte: EV-XXX]
o [nome do produto]
é um [categoria do produto]
que [benefício-chave, razão para adquiri-lo] [Fonte: EV-XXX]
diferentemente de [alternativa da concorrência]
o nosso produto [diferença-chave] [Fonte: EV-XXX]

## Lacunas
[⚠️ Pendente: BL-XXX] — [lacuna para fechar a frase]
```

**`product-enfn.md`** — É / Não é / Faz / Não faz (dica de Caroli: *É* =
substantivo/adjetivo; *Faz* = verbo/ação):
```markdown
# O Produto É – Não é – Faz – Não faz — [Nome]

| É (substantivo/adjetivo) | Não é |
|---|---|
| [característica] [Fonte: EV-XXX] | [...] [Fonte: EV-XXX] |

| Faz (verbo/ação) | Não faz |
|---|---|
| [ação] [Fonte: EV-XXX] | [...] [Fonte: EV-XXX] |
```

**`objectives.md`** — Objetivos do produto (3 principais) + trade-offs (opcional):
```markdown
# Objetivos do Produto — [Nome]

1. [Objetivo de negócio] [Fonte: EV-XXX]
2. [Objetivo de negócio] [Fonte: EV-XXX]
3. [Objetivo de negócio] [Fonte: EV-XXX]

## Trade-offs (opcional)
| Categoria | Nível de importância (1 = menos importante) |
|---|---|
| [ex.: segurança] | [...] |
| [ex.: usabilidade] | [...] |
```

**`personas.md`** — Personas (template de Caroli) + mapa de empatia (opcional):
```markdown
# Personas — [Nome do Produto]

## Persona: [Apelido] [Fonte: EV-XXX]
- **Perfil:** [idade, papel/ocupação, formação, contexto] [Fonte: EV-XXX]
- **Comportamento:** [traços comportamentais] [Fonte: EV-XXX]
- **Necessidades:** [necessidades específicas] [Fonte: EV-XXX | ⚠️ Pendente: BL-XXX]

### Mapa de empatia (opcional)
- **Vejo:** [...] · **Ouço:** [...] · **Penso/Sinto:** [...] · **Falo/Faço:** [...]
- **Dores:** [...] · **Ganhos:** [...]
```

**`features.md`** — Brainstorming de funcionalidades (Objetivos × Personas) +
Revisão técnica, de negócio e de UX (gráfico do semáforo + tabela):
```markdown
# Funcionalidades — [Nome]

> Brainstorming guiado por Objetivos (colunas) × Personas (linhas).
> Revisão: Confiança pelo gráfico do semáforo (🟢 alto / 🟡 médio / 🔴 baixo,
> combinando confiança técnica "como fazer" × confiança negócio/UX "o que fazer").
> Marcações: Esforço E/EE/EEE · Negócio $/$$/$$$ · UX ♥/♥♥/♥♥♥.

| Funcionalidade | Persona | Objetivo | Confiança | Esforço | Negócio | UX | Jornada de origem |
|---|---|---|---|---|---|---|---|
| [func] [Fonte: EV-XXX] | [apelido] | [objetivo] | 🟢/🟡/🔴 | EE | $$ | ♥♥♥ | Jornada: [nome] |

> Funcionalidade 🔴 marcada com "X" (baixa confiança técnica E de negócio/UX):
> descartar ou esclarecer antes de prosseguir. Funcionalidade sem persona
> associada: descartar ou repensar.
```

**`journeys.md`** — Jornadas dos usuários (com funcionalidades nas jornadas):
```markdown
# Jornadas dos Usuários — [Nome]

## Jornada: [nome] — Persona [apelido] · Objetivo: [...] [Fonte: EV-XXX]
- **Ponto de partida:** [o que desencadeia o desejo de atingir o objetivo]
- **Passos:** 1. [...] → 2. [...] → 3. [...] → [objetivo alcançado]
- **Funcionalidades nesta jornada:** [F1, F2, …] (→ features.md)
- **Dores/atritos:** [Fonte: EV-XXX | ⚠️ Pendente: BL-XXX]
```

**`sequencer.md`** — Sequenciador (ondas + 6 regras) + Esforço/Tempo/Custo:
```markdown
# Sequenciador de Funcionalidades — [Nome]

> Regras de Caroli para cada onda:
> 1) máx. 3 cartões · 2) máx. 1 vermelho · 3) não 3 só amarelos/vermelhos
> 4) Σ esforço ≤ 5E · 5) Σ valor ≥ 4$ e 4♥ · 6) dependência sempre em onda anterior.

| Onda | Funcionalidades (≤3) | Σ Esforço | Σ $ | Σ ♥ | MVP |
|---|---|---|---|---|---|
| 1 | F1, F2, F3 | 4E | $$$$ | ♥♥♥♥♥ | MVP1 |
| 2 | F4, F5 | 3E | $$$$$ | ♥♥♥♥ | MVP1 |
| 3 | F6, F7, F8 | 5E | $$$$ | ♥♥♥♥ | MVP2 |

## Esforço, tempo e custo (por amostragem de ondas)
- **Ondas amostradas:** [ex.: 1 e 3]
- **Tarefas detalhadas / tamanho médio de onda:** [...]
- **Estimativa MVP1:** [tempo/custo] [Fonte: EV-XXX | ⚠️ Pendente: BL-XXX]
```

**`mvp-canvas.md`** — Canvas MVP (7 blocos, na ordem de Caroli):
```markdown
# Canvas MVP — [Nome do MVP]

1. **Proposta do MVP** — Qual é a proposta deste MVP? [Fonte: EV-XXX]
2. **Personas segmentadas** — Para quem é? Dá para testar num grupo menor? [Fonte: EV-XXX]
3. **Jornadas** — Quais jornadas são atendidas/melhoradas? (→ journeys.md)
4. **Funcionalidades** — O que vamos construir / que ações serão melhoradas? (→ sequencer.md)
5. **Resultado esperado** — Que aprendizado/resultado buscamos? [Fonte: EV-XXX | ⚠️ Pendente: BL-XXX]
6. **Métricas para validar as hipóteses do negócio** — Como medir os resultados? [Fonte: EV-XXX | ⚠️ Pendente: BL-XXX]
7. **Custo e Cronograma** — Custo e data prevista para a entrega? [Fonte: EV-XXX | ⚠️ Pendente: BL-XXX]
```

> **Faça no máximo três canvas MVP** (um por MVP do sequenciador), e só preencha os
> dos primeiros MVPs — fiel à recomendação de Caroli de não ir longe demais.

---

### 8.3 Módulo DDD (`docs/ddd/`) — fiel a Eric Evans

Cinco artefatos que respondem exatamente às perguntas que os insights levantaram:
quais subdomínios e bounded contexts emergem, qual a linguagem ubíqua implícita,
onde há contextos compartilhados, quais agregados aparecem e onde o acoplamento é
baixo. Todo bloco factual referencia o substrato (`[Fonte: EV-XXX]`) ou marca
pendência. O DDD **lê** o substrato neutro e **interpreta** — a classificação
(Core/Supporting/Generic, limites de contexto, padrões de integração) é opinião do
método, não descoberta crua.

**`subdomains.md`** — Subdomínios no espaço do problema (Core / Supporting / Generic):
```markdown
# Subdomínios — [Domínio]

| Subdomínio | Tipo | Descrição | Capacidade(s) relacionada(s) | Evidência |
|---|---|---|---|---|
| Análise de risco de crédito | Core | diferencial competitivo do negócio | CAP-003 (→ capabilities.md) | → EV-040 |
| Notificação ao cliente | Supporting | necessário, mas não diferenciador | CAP-004 | → EV-041 |
| Autenticação | Generic | resolvido por solução de mercado | CAP-009 | → EV-052 |

> Tipo: **Core** (diferenciador, foco do investimento) · **Supporting** (apoia o
> core, específico do negócio) · **Generic** (commodity, candidato a comprar/terceirizar).
> Classificação incerta vira [⚠️ Pendente: BL-XXX] (consumidor: ddd).
```

**`bounded-contexts.md`** — Bounded contexts no espaço da solução, mapeados ao código:
```markdown
# Bounded Contexts — [Sistema]

## Contexto: [Nome do Contexto]
- **Subdomínio relacionado:** [...] (→ subdomains.md)
- **Responsabilidade:** [o que este contexto resolve e o que NÃO resolve]
- **Módulos/pacotes de código:** [ex.: credito/, billing/api] [Fonte: EV-XXX]
- **Linguagem ubíqua:** → ubiquitous-language.md#[contexto]
- **Acoplamento observado:** baixo | médio | alto — [evidência do acoplamento] [Fonte: EV-XXX]
- **Limite incerto:** [⚠️ Pendente: BL-XXX] — [o que falta para confirmar a fronteira]
```

**`ubiquitous-language.md`** — Linguagem ubíqua **por** bounded context (consome
`vocabulary.md`; é aqui que o mesmo termo ganha significados diferentes por contexto):
```markdown
# Linguagem Ubíqua — por Bounded Context

## Contexto: [Nome]
| Termo | Significado NESTE contexto | Termo no substrato | Evidência |
|---|---|---|---|
| Aprovação | etapa única de liberação automática | vocabulary.md#Aprovação | → EV-015 |
| Conta | carteira de crédito do cliente | vocabulary.md#Conta | → EV-061 |

## Contexto: [Outro Nome]
| Termo | Significado NESTE contexto | Termo no substrato | Evidência |
|---|---|---|---|
| Aprovação | fluxo de 2 alçadas (gerência + risco) | vocabulary.md#Aprovação | → EV-014 |

> O mesmo termo "Aprovação" significa coisas distintas em contextos distintos — esse
> é o sinal clássico de fronteira de contexto. Conflitos no `vocabulary.md` neutro
> frequentemente viram **dois significados legítimos** aqui, um por contexto.
```

**`context-map.md`** — Relacionamentos entre contextos (padrões de integração):
```markdown
# Mapa de Contextos — [Sistema]

| Upstream (montante) | Downstream (jusante) | Padrão de relacionamento | Evidência |
|---|---|---|---|
| Crédito | Notificação | Customer/Supplier | → EV-041 |
| Sistema Legado | Crédito | Anticorruption Layer (ACL) | → EV-050 |
| Crédito | Cobrança | Shared Kernel (modelo de "Fatura" compartilhado) | → EV-063 |
| Pagamentos | (externo) | Open Host Service + Published Language | → EV-070 |

> Padrões válidos: Partnership · Shared Kernel · Customer/Supplier · Conformist ·
> Anticorruption Layer (ACL) · Open Host Service (OHS) · Published Language ·
> Separate Ways · Big Ball of Mud.
> "Contextos compartilhados" (pergunta do insight) aparecem como **Shared Kernel**.
> Relacionamento não confirmado: [⚠️ Pendente: BL-XXX] (consumidor: ddd).
```

**`aggregates.md`** — Blocos táticos por contexto (agregados, entidades, VOs,
eventos, repositórios; invariantes consomem `business-rules.md`):
```markdown
# Agregados — Contexto [Nome]

## Agregado: [Raiz do Agregado]
- **Raiz (entidade):** [ex.: Proposta] [Fonte: EV-XXX]
- **Entidades:** [ex.: ItemDaProposta] [Fonte: EV-XXX]
- **Objetos de valor:** [ex.: Valor, CPF, Período] [Fonte: EV-XXX]
- **Invariantes (regras que o agregado protege):** [ex.: total = soma dos itens]
  (→ business-rules.md#BR-007) [Fonte: EV-XXX]
- **Eventos de domínio publicados:** [ex.: PropostaAprovada, PropostaRecusada] [Fonte: EV-XXX]
- **Repositório:** [ex.: PropostaRepository] [Fonte: EV-XXX]
- **Incerteza de modelagem:** [⚠️ Pendente: BL-XXX] — [ex.: fronteira do agregado a confirmar]

> Eventos de domínio aqui são os do **modelo tático** (publicados por um agregado).
> A linha do tempo de processo/descoberta de eventos candidatos em filas e APIs é
> escopo do futuro módulo **Event Storming**, não deste — evitando sobreposição.
```

---

## 9. Decisões fechadas nesta sessão

1. **Reposicionamento:** o plugin é o **CAD** (metodologia de descoberta), e a Lean
   Inception é o **primeiro consumidor**, não o teto da proposta.
2. **Três comandos:** `/cad:discovery`, `/cad:synthesize <técnica>`, `/cad:backlog`.
3. **Substrato neutro × módulos de técnica:** `docs/cad/` guarda conhecimento
   descritivo; `docs/<técnica>/` guarda artefatos opinativos de um método só.
4. **Isolamento por técnica** vira princípio não-negociável (4 → agora princípio 3),
   reforçado por hook: módulo lê só o substrato, escreve só na própria pasta, e tem
   `vocabulario_proibido` de outras técnicas.
5. **Contrato de módulo (seção 5):** manifesto fixo declarando entradas, saída,
   artefatos e vocabulário proibido — permite plugar DDD/Event Storming/etc. sem
   tocar no núcleo.
6. **Templates da Lean Inception revisados para fidelidade ao livro de Caroli**
   (seção 8.2): Visão (Geoffrey Moore), ENFN, Objetivos, Personas, Funcionalidades
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
13. **Módulo DDD totalmente especificado (v13)** como segundo módulo plugado
    (seção 8.3): `subdomains.md` (Core/Supporting/Generic), `bounded-contexts.md`
    (com mapeamento a módulos de código e acoplamento), `ubiquitous-language.md`
    (linguagem ubíqua por contexto, consumindo `vocabulary.md`), `context-map.md`
    (padrões ACL/OHS/Shared Kernel/…) e `aggregates.md` (agregados, entidades, VOs,
    eventos de domínio, invariantes consumindo `business-rules.md`). Prova o contrato
    da seção 5 com dois métodos sobre o mesmo substrato, sem mistura.
14. **Convenção de nomenclatura única (v13.1, seção 3.0):** todo identificador de
    skill, pasta, argumento de comando e marcação de backlog deriva do **nome
    programático** da técnica (`lean-inception`, `ddd`, `cad`). Elimina o ambíguo
    `lean-module`, que vira `lean-inception-module`; nome completo/exibição ficam só
    em prosa e no campo `metodo_de_origem`.
15. **Toolchain em Node.js + TypeScript (v13.2, seção 11):** ESM, `esbuild`, versão de
    fonte única no `package.json` e build em `.mjs` — escolhido por portabilidade
    (Windows/macOS/Linux), JSON nativo e zero dependências em runtime. O CAD **não tem
    servidor MCP** (lê o repositório do cliente com ferramentas nativas), então não
    inclui SDK de MCP, cliente HTTP, empacotamento `.mcpb` nem `mcpServers`; compila só
    **hooks + helpers**. O contrato de módulo é formalizado como `module.json` (JSON),
    parseável pelos hooks sem dependência.
16. **Repositório e nome de pacote (v13.3):** repositório `CAD-Claude-Plugin`,
    pacote/manifesto e artefato `cad-claude-plugin` (e `cad-claude-plugin.plugin`).
    Identificadores de plataforma (`/cad:`, skills `cad-*`,
    controle `.cad-plugin/`) permanecem, pois derivam do nome programático `cad`.

---

## 10. Hooks (enforcement determinístico)

Em `hooks/hooks.json`, carregados quando o plugin está habilitado. Os três hooks são
TypeScript (`src/hooks/*.ts`) compilados para `.cjs` autossuficientes (ver seção 11)
e referenciados como `node ${CLAUDE_PLUGIN_ROOT}/build/hooks/<hook>.cjs`. Não têm
dependência em runtime — usam só a stdlib do Node e `JSON.parse` nativo (inclusive
para ler o `module.json` de cada técnica).

| Hook | Evento | Função |
|---|---|---|
| **Validação de evidência** | `PostToolUse`, matcher `Write\|Edit`, filtrado a `docs/cad/*.md` e `docs/*/*.md` | Verifica se todo bloco factual contém `[Fonte: EV-XXX]` ou `[⚠️ Pendente: BL-XXX]`; bloqueia (exit 2) e devolve o motivo se faltar — reforça o princípio 1. |
| **Proteção de validação humana** | `PreToolUse`, matcher `Write\|Edit`, filtrado a `docs/**/*.md` | Bloqueia remoção/sobrescrita de bloco com origem "validação humana" fora de `/cad:backlog` — reforça o princípio 7. |
| **Isolamento por técnica** | `PreToolUse`, matcher `Write\|Edit` | Lê o `module.json` do módulo em execução e bloqueia se: (a) a escrita for fora de `pasta_saida`; ou (b) o conteúdo contiver algum termo de `vocabulario_proibido` — reforça o princípio 3 (não-misturar técnicas). |

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

> O **DDD** saiu desta lista — está totalmente especificado na seção 8.3 como
> segundo módulo plugado.

- **Event Storming** (`docs/event-storming/`) — eventos de domínio, comandos,
  políticas, *read models*, candidatos identificados em código, filas, APIs e bancos.
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
- **Análise de stakeholders** (`docs/stakeholders/`) — mapa interesse × influência
  (o ex-`stakeholders.md` da v11, agora como técnica própria).

---

## 13. Próximos passos sugeridos

- Detalhar o conteúdo exato de cada `SKILL.md` (instruções do agente por comando e
  por documento), começando pelos 3 orquestradores e pelos módulos Lean e DDD.
- Definir o formato de citação de paráfrase (limite de palavras, estilo) para o
  `evidence-log`, evitando reprodução literal de documentos normativos/corporativos
  protegidos.
- Especificar o **mínimo necessário do substrato** que `/cad:synthesize <técnica>`
  exige antes de gerar cada artefato (ex.: Lean `mvp-canvas.md` exige objetivos,
  personas, jornadas e sequenciador; DDD `aggregates.md` exige `business-rules.md` e
  `bounded-contexts.md` já preenchidos).
- Definir como o DDD lida com **conflitos do `vocabulary.md` que viram dois
  significados legítimos** (um por contexto) em `ubiquitous-language.md` — quando é
  fronteira de contexto e quando é divergência a resolver via `/cad:backlog`.
- Implementar os 3 hooks da seção 10 (`hooks/hooks.json`), incluindo o
  `vocabulario_proibido` simétrico entre Lean e DDD, no toolchain da seção 11
  (TypeScript em `src/hooks/`, compilado por `esbuild` para `build/hooks/*.cjs`).
- Prototipar o ciclo completo (`/cad:discovery` → `/cad:synthesize lean-inception` →
  `/cad:synthesize ddd` → `/cad:backlog`) num repositório piloto pequeno, validando o
  apêndice incremental, a proteção de blocos validados e o isolamento por técnica
  **entre dois módulos**.
- Especificar o **terceiro módulo (Event Storming)** como próxima prova do contrato,
  cuidando da fronteira com o DDD quanto a eventos de domínio (seção 8.3).