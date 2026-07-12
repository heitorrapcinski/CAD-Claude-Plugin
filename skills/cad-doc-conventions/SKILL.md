---
name: cad-doc-conventions
description: Convenção única do Knowledge Vault do CAD — schema de frontmatter, componentes permitidos (Markdown/Obsidian/Mermaid/PlantUML/callouts/[[links]]), a taxonomia numerada 01–13, a filosofia Knowledge×Discovery, e os tipos/status de nota. Referência citada por todas as skills de substrato e pela /cad:discovery.
---

# cad-doc-conventions — Convenções do Knowledge Vault (substrato neutro)

## Objetivo

Definir **como toda nota do substrato é escrita**, para que `docs/knowledge-vault/` seja um
**Knowledge Vault** coeso e navegável no Obsidian: um conjunto de notas atômicas em
Markdown, cada uma rastreável até uma evidência. Esta skill é a **fonte única** das
convenções; as demais skills de substrato (`cad-doc-business`, `-system`, `-technical`,
`-evidence`, `-decisions`, `-investigations`, `-views`, `-mocs`) e a `/cad:discovery`
apontam para cá em vez de repetir as regras.

O vault é **independente de metodologia** (DDD, TOGAF, C4, UML…): descreve o sistema como
ele realmente existe. Opinião de método vive **fora** de `docs/knowledge-vault/`, nos módulos de
técnica (`/cad:synthesize`).

## Filosofia — Knowledge × Discovery

O vault separa **o conhecimento** do **processo que o produziu**:

- **Knowledge (01–08)** — o conhecimento consolidado sobre o System of Record: o que é,
  por que existe, do que é composto, como funciona, como foi implementado, como opera.
- **Discovery (09–13)** — o processo rastreável de engenharia reversa: as evidências que
  sustentam cada afirmação, as decisões/conclusões, o que ainda falta investigar, as
  visões gráficas e os mapas de navegação.

Toda nota de **Knowledge** idealmente aponta, via `source:`, para uma ou mais notas de
**Evidence** (`09 Evidence`). É isso que torna o vault uma **Knowledge Base rastreável**.

## Taxonomia (pastas `docs/knowledge-vault/01…13`)

A numeração é **guia** — pode variar por sistema; o que **não** varia é a separação
Knowledge×Discovery e a exigência de frontmatter + rastreabilidade.

| Pasta | Pergunta que responde | Conteúdo típico |
|---|---|---|
| `01 Overview` | O que é este sistema? | objetivo, escopo, histórico, funcionalidades, stakeholders, glossário, tecnologias |
| `02 Business Knowledge` | Por que o sistema existe? | processos, capacidades, regras de negócio, papéis, eventos de negócio, objetivos org. |
| `03 Structural Knowledge` | Do que é composto? | conceitos, componentes, módulos, serviços, interfaces, pacotes, relações (neutro) |
| `04 Behavioral Knowledge` | Como funciona? | fluxos, casos de uso, algoritmos, máquinas de estado, eventos, jobs, sequências |
| `05 Source Code` | Como foi implementado? | projetos, classes, métodos, frameworks, padrões, dependências entre módulos |
| `06 Data` | Que informações manipula? | bancos, tabelas, views, procedures, arquivos, modelos, estruturas, relações |
| `07 Integrations` | Com quem se comunica? | REST/SOAP, filas/mensageria, batch, arquivos, sistemas externos, protocolos |
| `08 Operational Architecture` | Como opera em produção? | Compute, Network, Storage, Deployment, Runtime, Monitoring, HA/DR, Capacity… |
| `09 Evidence` | Quais evidências sustentam? | trechos de código, SQL, logs, prints, entrevistas, configs (o artefato real) |
| `10 Decisions` | Quais conclusões foram tiradas? | ADRs, premissas, decisões arquiteturais identificadas, hipóteses confirmadas |
| `11 Investigations` | O que falta investigar? | perguntas abertas, hipóteses, experimentos, dúvidas, lacunas, pendências |
| `12 Views` | Como visualizar? | diagramas Mermaid/PlantUML, fluxogramas, arquitetura, dados, sequência, timelines |
| `13 MOCs` | Como navegar? | Maps of Content: índices por área que conectam notas relacionadas |

## Frontmatter (obrigatório em toda nota)

Toda nota **começa** com este bloco YAML:

```yaml
---
title:
aliases:
tags:
type:
status:
source:
author:
created:
---
```

- **`title`** — título legível da nota (pode ter acento/espaço). Casa com o nome do
  arquivo (`Cliente.md` → `title: Cliente`).
- **`aliases`** — nomes alternativos pelos quais a nota é referenciada (siglas, sinônimos).
- **`tags`** — palavras-chave livres (`#dominio/credito`, `#tabela`, `#externo`).
- **`type`** — natureza da nota. Valores usuais: `overview`, `concept`, `entity`,
  `component`, `module`, `service`, `interface`, `rule`, `process`, `capability`,
  `actor`, `event`, `use-case`, `flow`, `algorithm`, `state-machine`, `job`, `class`,
  `table`, `view`, `procedure`, `integration`, `infra`, `evidence`, `adr`, `decision`,
  `investigation`, `view`, `moc`. A lista é **aberta** — use o mais específico.
- **`status`** — maturidade/confiança da afirmação:
  - `draft` — rascunho, ainda sendo escrito.
  - `confirmed` — sustentado por evidência direta.
  - `inferred` — derivado/deduzido (marque a inferência no corpo).
  - `conflicting` — há divergência entre fontes (abra nota em `11 Investigations`).
  - `open` — pergunta/lacuna ainda sem resposta (típico de `11 Investigations`).
  - `validated` — confirmado por **validação humana** (a evidência mais forte).
- **`source`** — a **rastreabilidade** (ver abaixo). Nunca deixe vazio numa nota de
  Knowledge confirmada/inferida.
- **`author`** — quem produziu a nota (`CAD Discovery` ou o consultor).
- **`created`** — data ISO (`2026-07-10`).

### O campo `source` (o coração da rastreabilidade)

- **Nota de Knowledge (01–08), Decisions (10), Views (12):** `source` aponta para a(s)
  nota(s) de evidência que a sustentam — via wikilink **pelo título completo da nota**, com
  o código como texto de exibição. **Uma** evidência (escalar):
  `source: "[[EV-5-a2-007 · Aprovação exige duas alçadas|EV-5-a2-007]]"`. **Várias**
  evidências → **lista YAML**, um link por item (ver a regra de referência abaixo). **Não**
  cite pelo código sozinho (`[[EV-5-a2-007]]`). Sem evidência clara, **não afirme**: abra
  `11 Investigations`.
- **Nota de Evidence (09):** a nota **é** a fonte. Aqui `source` traz `SRC-XXX` + a
  localização (`SRC-002 · normativo_credito_v3.pdf · Seção 4.2`). `SRC-XXX` liga à fonte
  autorizada registrada em `.cad-plugin/sources.json`.
- **Validação humana:** `source: "validação humana (consultor) — 2026-07-10"` e
  `status: validated`. Supera a hierarquia de fontes para o ponto resolvido.
- **Investigation aberta (11):** pode não ter fonte confirmada (`status: open`); registre
  no corpo o que disparou a dúvida.
- **MOC (13):** índice de navegação; deriva de notas já evidenciadas — dispensa `source`.

### Identidade de fontes e evidências (IDs sem colisão)

Discovery pode rodar em **paralelo** (map-reduce com subagentes) para escopo grande — por
isso os IDs são projetados para **não colidir** entre escritores concorrentes, sem RNG e
sem escritor central:

- **`SRC-NNN`** (fonte autorizada) é atribuído **uma vez, pelo orquestrador**, ao registrar
  a fonte em `.cad-plugin/sources.json`. Escritor único, sem concorrência.
- **`EV-<sessão>-<agente>-<seq>`** (nota de evidência em `09 Evidence`) — padrão worker-id +
  sequência:
  - **`<sessão>`** — o número da sessão de discovery (do `state.json`, incrementado pelo
    orquestrador). Garante unicidade **entre runs** ao longo do tempo.
  - **`<agente>`** — o id que o orquestrador dá a cada subagente no dispatch (`a1`, `a2`…).
    Cada subagente é dono do seu espaço de IDs → colisão impossível entre subagentes.
  - **`<seq>`** — sequencial **por agente**, começando em 1 (cada subagente conta só as
    próprias evidências, o que erra muito menos que um contador global).
  - Ex.: `EV-5-a2-007`. No modo de **1 agente** (escopo pequeno) o `<agente>` é omitido:
    `EV-<sessão>-<seq>` → `EV-5-014`.
- **Handle curto + título legível.** O código é a chave estável; a legibilidade vem do
  **título** da nota, que carrega o resumo: `title: EV-5-a2-007 · Aprovação exige duas
  alçadas`. Mantenha também `aliases: [EV-5-a2-007]` (ajuda busca/autocomplete).
- **MOCs e o Registro de Evidências são consolidados só no reduce** (pelo orquestrador),
  nunca por um subagente — é lá que o domínio/escopo agrupa as evidências, e onde dedup de
  conceito e conflito entre fontes se resolvem.

### Como referenciar uma evidência (evite links órfãos)

O Obsidian resolve `[[...]]` **pelo nome do arquivo** primeiro; um link para um **alias** de
frontmatter pode **não resolver** e vira um **nó órfão** no grafo. Por isso:

- **Sempre linke pelo título completo** da nota de evidência (o nome do arquivo), e use
  `|` para exibir o código curto:
  `[[EV-5-a2-007 · Aprovação exige duas alçadas|EV-5-a2-007]]`.
- **Nunca** cite a evidência pelo código sozinho (`[[EV-5-a2-007]]`) — mesmo com `aliases`
  definido, o link pode ficar órfão.
- Como as evidências são **imutáveis**, o título completo é **estável** — o link não quebra.
- Vale para o `source:` do frontmatter, para o corpo das notas e para os MOCs.
- **Dentro de célula de tabela, escape o pipe do alias como `\|`** — em tabela Markdown o `|`
  é separador de coluna, então um link com alias não escapado quebra a célula e o link vira
  texto cru. Em tabela: `| [[EV-5-a2-007 · Aprovação exige duas alçadas\|EV-5-a2-007]] | … |`.
  Fora de tabela (listas, corpo, frontmatter), use `|` normal.
- **Várias evidências no `source:` → use uma lista YAML**, um link por item. Vários
  `[[...]]` **numa mesma string não funcionam** (o Obsidian não separa e perde os links):

  ```yaml
  # ✔ correto (lista YAML)
  source:
    - "[[EV-1-001 · CommonITILObject define statuses|EV-1-001]]"
    - "[[EV-1-007 · Matriz de prioridade|EV-1-007]]"

  # ✘ errado (vários links numa string só)
  source: "[[EV-1-001]], [[EV-1-007]]"
  ```

  No **corpo** da nota (fora do frontmatter), vários `[[...]]` na mesma linha funcionam
  normalmente — a restrição da lista é só do frontmatter.

## Componentes permitidos no corpo

- **Markdown** puro (títulos, listas, tabelas, ênfase).
- **Obsidian**: `[[wikilinks]]` para conectar notas (`[[Cliente]]`, `[[TB_CLIENTE]]`; para
  evidências, pelo título completo — `[[EV-5-a2-007 · Aprovação exige duas alçadas|EV-5-a2-007]]`);
  embeds `![[...]]` quando fizer sentido.
- **Mermaid / PlantUML** em cerca de código (` ```mermaid ` / ` ```plantuml `). Diagramas
  substanciais vão em `12 Views` e são referenciados por `[[...]]`.
- **Callouts** do Obsidian para destacar contexto:
  `> [!note]`, `> [!warning]`, `> [!question]`, `> [!quote]`.
- **Frontmatter YAML** (obrigatório, acima).

## Convenções de nome e link

- **Um conceito, uma nota.** Notas atômicas: uma entidade, uma regra, uma tabela, uma
  integração por arquivo. O nome do arquivo é o título natural (`Emissão de Documento.md`).
- **Ligue liberalmente.** Sempre que citar outra coisa que tem (ou deveria ter) nota, use
  `[[...]]`. Um `[[link]]` para nota inexistente é aceitável — sinaliza uma nota a criar
  (ou uma investigação a abrir).
- **Relações explícitas.** Prefira frases com o link no meio a listas soltas:
  `[[Cliente]] é persistido em [[TB_CLIENTE]]`.

## Regra de evidência (resumo — detalhe em `cad-doc-evidence`)

```
Há evidência rastreável (código/doc/SQL/log/config/entrevista)?
  SIM → cria/aponta nota em 09 Evidence, e a nota de Knowledge referencia via source:
  NÃO → NÃO afirma, NÃO assume → cria nota em 11 Investigations (status: open)
Fontes conflitam?
  → aplica hierarquia (Normativo > Corporativo > Código > Informal): registra a versão
    priorizada (status: conflicting) e abre 11 Investigations com o conflito
Bloco/nota validada por humano?
  → NUNCA sobrescreve fora de /cad:backlog; conflito novo vira investigação
```

Hierarquia de fontes para conflitos: **(1) Normativo/regulatório → (2) Documentação
corporativa oficial → (3) Código-fonte → (4) Documentação técnica informal.** A validação
humana (via `/cad:backlog`) supera todas.

## Vocabulário proibido

O substrato é **neutro**: nenhum conceito de técnica (bounded context, agregado, MVP,
persona, jornada Lean, evento-pivô, linguagem ubíqua…) entra nas notas de `docs/knowledge-vault/`.
Esses conceitos são opinião de método e vivem só nas pastas de técnica (`docs/<técnica>/`).
