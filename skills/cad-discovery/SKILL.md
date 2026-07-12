---
name: cad-discovery
description: Orquestrador /cad:discovery — escaneia exatamente as fontes indicadas pelo consultor e estrutura o conhecimento como um Knowledge Vault Zettelkasten/Obsidian em docs/knowledge-vault/ (notas com frontmatter, [[links]], evidências rastreáveis nas pastas 01–13). Cobertura total e profundidade máxima são inegociáveis; quando o esforço é grande, o trabalho é FASEADO em etapas de valor (por módulo), nunca reduzido. Abre notas em 11 Investigations para o que não tem evidência. Não gera nenhum artefato de técnica.
argument-hint: "[fontes...]  (ex.: credito/ normativo_credito_v3.pdf)"
---

# /cad:discovery — Descoberta como Knowledge Vault (substrato neutro)

## Objetivo

Escanear **somente** as fontes que o consultor passou e **percorrê-las por inteiro**,
estruturando o conhecimento extraído como um **Knowledge Vault** pronto para o Obsidian em
`docs/knowledge-vault/`: notas atômicas em Markdown, com **frontmatter YAML**, `[[links internos]]`,
callouts e Mermaid, organizadas na taxonomia numerada `01…13`. Cada afirmação é rastreável
até uma **nota de evidência** (`09 Evidence`). Tudo que não tem evidência clara vira uma
nota em `11 Investigations`. **Este comando nunca gera artefato de técnica** (nada em
`docs/lean-inception/`, `docs/ddd/`, etc.).

As convenções de nota (frontmatter, componentes, taxonomia, filosofia Knowledge×Discovery)
são a **fonte única** da skill [`knowledge-vault-doc-conventions`](../knowledge-vault-doc-conventions/SKILL.md) —
carregue-a antes de escrever qualquer nota.

## Entradas

- **Argumento `[fontes]`** — lista explícita de caminhos (arquivos ou pastas) e/ou
  normativos a escanear nesta sessão. Se vazio, **pergunte** ao consultor quais fontes
  escanear; **nunca** escaneie por conta própria uma fonte **nova** de sessões anteriores:
  o escopo de scan é sempre humano. A síntese (`/cad:synthesize`) **nunca** lê fontes — só
  a descoberta escaneia, e apenas o que o consultor autorizou.
- `.cad-plugin/state.json` e `.cad-plugin/sources.json` (se existirem) — sessão atual e
  histórico. Se não existirem, crie-os.

## Estratégia de execução — cobertura total, entregue em etapas

**Escopo e profundidade não são negociáveis.** A fonte autorizada é lida **por inteiro**, na
**maior profundidade** que ela sustenta — todo módulo, classe, tabela, integração, config,
até o fato mais fino. A descoberta **nunca** oferece cobrir menos, nem de forma rasa, para
poupar esforço: entregar um retrato parcial **enviesa o humano** e fere "sem evidência, sem
afirmação". O consultor escolhe **quais fontes** autorizar (na entrada); uma vez autorizada,
a fonte é coberta **integralmente**.

O que se ajusta ao tamanho do esforço é **só o faseamento** — entregar a cobertura total em
**etapas de valor**, jamais reduzir a cobertura:

- **Esforço pequeno → uma etapa.** Um passe cobre tudo (você mesmo, área por área; o **vault
  em disco é a memória** entre passes — releia-o conforme precisar).
- **Esforço grande → várias etapas por valor.** Particione a fonte em fatias coesas que
  entregam valor sozinhas (por **módulo/subsistema** de preferência; por camada `01…13`
  quando a fonte for monolítica). Cada etapa gera **tudo** da sua fatia, na **maior
  profundidade**, como incremento coerente no vault. Ao fim da última etapa, a cobertura é
  **100%**.

> **O humano decide o faseamento, não o escopo.** Você apresenta o **plano de etapas** (as
> fatias e uma ordem sugerida); o consultor **reordena/prioriza** e define os **checkpoints**
> (ex.: "comece pelo módulo de crédito", "pare após cada etapa"). Ele **não** corta escopo
> nem profundidade — só escolhe a **ordem** e **quando pausar**. Nunca proponha "coletar só
> parte" como alternativa ao esforço; proponha **como dividir** e **em que ordem entregar**.

> **Dentro de uma etapa, paralelize se ajudar.** Uma etapa grande pode ser feita em
> **map-reduce**: subagentes fazem o *map* (extrair/escrever a sua sub-fatia); só o
> orquestrador faz o *reduce* (MOCs, dedup e **conflito entre fontes**). Se o runtime não
> oferecer subagentes, faça a etapa com 1 agente. Como o **vault em disco acumula**, o reduce
> de cada etapa roda contra **tudo o que já existe** — então conflito com uma etapa anterior
> aparece quando a etapa nova aterrissa.

## Procedimento

### 0. Preparação e plano de etapas (orquestrador, antes de qualquer nota)

1. **Registrar fontes** (escritor único: você). Para cada fonte do argumento, faça
   **append** em `.cad-plugin/sources.json` uma entrada com `id` (`SRC-NNN`, sequencial),
   `caminho`, `tipo` (`Normativo` | `Corporativo` | `Código` | `Informal`), `sessao` e
   `data`. Incremente a sessão em `state.json`. Os `SRC` são atribuídos **aqui, de uma vez**
   — os subagentes recebem a lista pronta e **não** criam `SRC`.
2. **Avaliar o esforço e montar o plano de etapas.** Estime o tamanho da fonte
   (nº de arquivos/módulos/áreas). Se couber num passe, é **uma etapa**. Se for grande,
   **particione em etapas de valor** (por módulo/subsistema de preferência), cada uma
   cobrindo **integralmente** a sua fatia. **Não reduza escopo nem profundidade** — o plano
   sempre cobre 100% da fonte; o que você propõe é a **divisão e a ordem**.
3. **Confirmar o faseamento com o humano (não o escopo).** Apresente as etapas e uma ordem
   sugerida; deixe o consultor reordenar/priorizar e definir os checkpoints. Deixe explícito
   que a meta é **cobertura total** e que ele escolhe **sequência**, não quanto coletar.
   Registre o plano (etapas e ordem) no `state.json`.

### Laço por etapa (repita até 100% de cobertura)

Para cada etapa do plano, na ordem definida:

**a) Coletar a fatia, na maior profundidade.** Faça a etapa com 1 agente (fatia menor) ou
   em **map-reduce** (fatia grande). No map-reduce, dispare **subagentes de propósito geral
   (com escrita)** com o briefing abaixo; atribua a cada um um **id** (`a1`, `a2`…) que entra
   no id das evidências (`EV-<sessão>-<agente>-<seq>`). Em ambos os casos, execute os
   **passos comuns** (adiante) até **esgotar** a fatia — nada de amostra.

**b) Reduce da etapa (só o orquestrador).** Ao fim da fatia, consolide **contra o vault
   acumulado**:
   - **Navegação:** construa/atualize os **MOCs** (`13 MOCs`, via `knowledge-vault-doc-mocs`) e o
     **Registro de Evidências** (via `knowledge-vault-doc-evidence`), agrupando por `SRC` e domínio/escopo.
   - **Dedup de conceito transversal:** o mesmo conceito (`Cliente`) pode ter surgido em
     mais de uma fatia/etapa. Funda numa nota canônica (ou ligue as variantes) e conserte os
     `[[links]]`.
   - **Conflito entre fontes (só o todo enxerga):** compare com o que já existe no vault.
     Onde divergir, aplique a **hierarquia** (Normativo > Corporativo > Código > Informal),
     registre a versão priorizada (`status: conflicting`) e abra `11 Investigations` ligando
     as evidências divergentes.

**c) Entregar valor e registrar progresso.** Marque a etapa como concluída no `state.json`
   (etapas concluídas / total) e **reporte o incremento** ao consultor (o que a etapa
   adicionou ao vault + investigações abertas). Havendo checkpoint, pause para ele seguir ou
   parar; a descoberta **retoma** da próxima etapa na sessão seguinte.

#### Briefing do subagente (map, dentro de uma etapa)

- **Escopo:** exatamente os caminhos da **sub-fatia** — **não** saia deles, **não** registre
  fontes novas. Cubra a sub-fatia **por inteiro**, na maior profundidade.
- **Id do agente:** o tag dado no dispatch (ex.: `a2`) — use-o nos IDs de evidência:
  `EV-<sessão>-<agente>-<seq>` (ex.: `EV-5-a2-007`), com `<seq>` sequencial **por agente**,
  começando em 1. IDs **sem colisão** entre subagentes e entre runs, sem escritor central.
  O **título** da nota é `EV-<id> · <resumo>`; ao referenciar a evidência, linke **pelo
  título completo** com o código como exibição —
  `[[EV-5-a2-007 · Aprovação exige duas alçadas|EV-5-a2-007]]` (nunca `[[EV-5-a2-007]]`
  sozinho, que fica órfão no grafo).
- **Skills a seguir:** [`knowledge-vault-doc-conventions`](../knowledge-vault-doc-conventions/SKILL.md) (backbone) +
  as de camada conforme o conteúdo — `knowledge-vault-doc-evidence` (09), `knowledge-vault-doc-business` (01–02),
  `knowledge-vault-doc-system` (03–04), `knowledge-vault-doc-technical` (05–08), `knowledge-vault-doc-decisions` (10),
  `knowledge-vault-doc-views` (12).
- **O que produzir:** capture a evidência **primeiro** (nota em `09 Evidence` com
  `source: SRC-NNN + localização`), depois as notas de Knowledge ligadas a ela via `source:`,
  e abra `11 Investigations` (`tags: consumidor/cad`) para as lacunas **da sua sub-fatia**.
- **O que NÃO fazer:** não escreva MOCs (13), não crie o Registro de Evidências, não resolva
  conflito entre fatias, não toque em `sources.json`/`state.json`. Links `[[...]]` para notas
  que outra fatia vai criar são aceitáveis (ficam pendentes — é Zettelkasten).

### Passos comuns (por você no modo de 1 agente, ou por cada subagente no map-reduce)

i. **Capturar evidência primeiro.** Para cada afirmação que a fonte sustenta, crie/atualize
   a nota de evidência em `09 Evidence` (via [`knowledge-vault-doc-evidence`](../knowledge-vault-doc-evidence/SKILL.md)):
   o artefato real (trecho de código, SQL, log, config, paráfrase de normativo),
   `source: SRC-NNN + localização`, e a lista **Sustenta**.
ii. **Materializar o conhecimento em notas**, cada uma ligada à sua evidência via `source:`,
   distribuídas pelas pastas conforme a natureza — delegando à skill de cada camada
   (Knowledge 01–08: `knowledge-vault-doc-business`, `knowledge-vault-doc-system`, `knowledge-vault-doc-technical`; Discovery
   10/12: `knowledge-vault-doc-decisions`, `knowledge-vault-doc-views`). **Ligue liberalmente** (`[[...]]`).
iii. **Aplicar a regra de evidência** (detalhe em `knowledge-vault-doc-conventions`):
   - Sem evidência clara → **não afirme, não assuma** → abra nota em `11 Investigations`
     (via [`knowledge-vault-doc-investigations`](../knowledge-vault-doc-investigations/SKILL.md), `status: open`,
     `tags: consumidor/cad`).
   - Definições conflitantes **dentro da fatia** → hierarquia + `status: conflicting` +
     investigação. (Conflito **entre** fatias/etapas é resolvido no reduce.)
   - Nota já validada por humano → **nunca sobrescreva**; conflito novo abre investigação
     `conflito_pós_validação`.
iv. **Não tocar em nenhuma pasta de técnica.** Discovery escreve só em `docs/knowledge-vault/`.

## Saída ao final (por etapa e ao encerrar)

Atualize `state.json` (append no `historico`; registre o plano de etapas, quais já foram
concluídas e, no map-reduce, o nº de sub-fatias/subagentes). **Ao fim de cada etapa**,
reporte o incremento entregue. **Ao encerrar a sessão**, exiba um **resumo de cobertura**:
etapas concluídas / total (com a % de cobertura da fonte), fontes escaneadas, notas de
evidência criadas, notas por pasta (01–13) e a **lista de investigações abertas**
(`11 Investigations`). Se ainda faltam etapas, deixe claro **o que falta e por onde retomar**
— a meta é sempre fechar **100%** da fonte; o vault só está completo quando não há etapa
pendente.

## Regras inegociáveis

- Sem evidência, sem afirmação (a fonte vive numa nota de `09 Evidence`; o Knowledge liga a
  ela via `source:`).
- **Cobertura total e profundidade máxima não são negociáveis.** Toda a fonte autorizada é
  lida por inteiro, no maior nível de detalhe. Esforço grande vira **faseamento** (etapas de
  valor), **nunca** redução de escopo ou profundidade. Não ofereça "coletar só parte" ao
  humano — ofereça **como dividir e em que ordem entregar**.
- Escopo humano: só as fontes passadas. A síntese nunca lê fontes; ampliar o vault é só da
  descoberta. Fonte nova sempre volta ao humano.
- **Identidade sem colisão:** `SRC` é atribuído uma vez pelo orquestrador; `EV` é
  `EV-<sessão>-<agente>-<seq>` por subagente no map-reduce (ou `EV-<sessão>-<seq>` no modo de 1 agente).
  Só o orquestrador faz o reduce (MOCs, dedup, conflito cruzado).
- Apêndice, nunca sobrescrita em `sources.json`/`state.json`; evidências são imutáveis.
- Proteção de notas validadas por humano.
- Substrato é **neutro**: nenhuma opinião de método aqui (bounded context, MVP, agregado…).
