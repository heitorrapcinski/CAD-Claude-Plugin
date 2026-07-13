---
name: cad-discovery
description: Orquestrador /cad:discovery — escaneia exatamente as fontes indicadas pelo consultor e estrutura o conhecimento como um Knowledge Vault Zettelkasten/Obsidian em docs/knowledge-vault/ (notas com frontmatter, [[links]], evidências rastreáveis nas pastas 01–13). Cobertura total e profundidade máxima são inegociáveis: a fonte autorizada é lida por inteiro, na maior profundidade, nunca reduzida. Abre notas em 11 Investigations para o que não tem evidência. Não gera nenhum artefato de técnica.
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

## Estratégia de execução — cobertura total, na profundidade máxima

**Escopo e profundidade não são negociáveis.** A fonte autorizada é lida **por inteiro**, na
**maior profundidade** que ela sustenta — todo módulo, classe, tabela, integração, config,
até o fato mais fino. A descoberta **nunca** oferece cobrir menos, nem de forma rasa, para
poupar esforço: entregar um retrato parcial **enviesa o humano** e fere "sem evidência, sem
afirmação". O consultor escolhe **quais fontes** autorizar (na entrada); uma vez autorizada,
a fonte é coberta **integralmente**. A meta de toda sessão é fechar **100%** da fonte.

Seu trabalho é **cobrir tudo**, usando o **vault em disco como memória** entre passes
(releia-o conforme precisar). Se uma sessão não fechar 100%, a seguinte **retoma pelo que
ainda não foi coberto**.

**Deixe a fonte ditar a forma.** Como percorrer e ordenar a cobertura é decisão sua, guiada
pela natureza da fonte — por módulo/subsistema quando ela tem essa estrutura, por camada
`01…13` quando for monolítica, na ordem que melhor materializa o conhecimento. Não há um
modelo de execução fixo a seguir; o que é inegociável é o **resultado**: fonte coberta por
inteiro, na maior profundidade, cada afirmação ancorada em evidência. Como o **vault em disco
acumula**, a consolidação (MOCs, dedup, conflito entre fontes) roda contra **tudo o que já
existe** — inclusive o que sessões anteriores gravaram: o conflito com o vault existente
aparece quando a nota nova aterrissa.

## Procedimento

### 0. Preparação (antes de qualquer nota)

1. **Registrar fontes.** Para cada fonte do argumento, faça
   **append** em `.cad-plugin/sources.json` uma entrada com `id` (`SRC-NNN`, sequencial),
   `caminho`, `tipo` (`Normativo` | `Corporativo` | `Código` | `Informal`), `sessao` e
   `data`. Incremente a sessão em `state.json`. Os `SRC` são atribuídos **de uma vez**, no
   início da sessão.

### Execução — cobrir a fonte

**a) Coletar, na maior profundidade.** Percorra a fonte na ordem que ela melhor sustenta
   (por módulo/subsistema, ou por camada `01…13` quando monolítica), executando os
   **passos comuns** (adiante) até **esgotar** o escopo — nada de amostra.

**b) Consolidar contra o vault acumulado.** Conforme as notas aterrissam, mantenha o vault
   coerente:
   - **Navegação:** construa/atualize os **MOCs** (`13 MOCs`, via `knowledge-vault-doc-mocs`) e o
     **Registro de Evidências** (via `knowledge-vault-doc-evidence`), agrupando por `SRC` e domínio/escopo.
   - **Dedup de conceito transversal:** o mesmo conceito (`Cliente`) pode ter surgido em
     mais de uma área da fonte. Funda numa nota canônica (ou ligue as variantes) e conserte os
     `[[links]]`.
   - **Conflito entre fontes:** compare com o que já existe no vault.
     Onde divergir, aplique a **hierarquia** (Normativo > Corporativo > Código > Informal),
     registre a versão priorizada (`status: conflicting`) e abra `11 Investigations` ligando
     as evidências divergentes.

**c) Reportar e registrar progresso.** Registre no `state.json` o que foi coberto e
   **reporte ao consultor** o que a sessão adicionou ao vault + investigações abertas. Se a
   sessão não fechou 100% da fonte, deixe claro **o que falta e por onde retomar**; a
   descoberta **continua** pelo que ainda não foi coberto na sessão seguinte.

### Passos comuns (para cada área da fonte)

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
   - Definições conflitantes → hierarquia + `status: conflicting` + investigação.
   - Nota já validada por humano → **nunca sobrescreva**; conflito novo abre investigação
     `conflito_pós_validação`.
iv. **Não tocar em nenhuma pasta de técnica.** Discovery escreve só em `docs/knowledge-vault/`.

## Saída ao final

Atualize `state.json` (append no `historico`). **Ao encerrar a sessão**, exiba um **resumo de cobertura**: fontes
escaneadas, notas de evidência criadas, notas por pasta (01–13) e a **lista de investigações
abertas** (`11 Investigations`). Se a fonte não fechou 100%, deixe claro **o que falta e por
onde retomar** — a meta é sempre cobrir **100%** da fonte; o vault só está completo quando não
resta nada da fonte por percorrer.

## Regras inegociáveis

- Sem evidência, sem afirmação (a fonte vive numa nota de `09 Evidence`; o Knowledge liga a
  ela via `source:`).
- **Cobertura total e profundidade máxima não são negociáveis.** Toda a fonte autorizada é
  lida por inteiro, no maior nível de detalhe. Esforço grande **nunca** vira redução de escopo
  ou profundidade. Não ofereça "coletar só parte" ao humano — a fonte autorizada é sempre
  coberta por inteiro.
- Escopo humano: só as fontes passadas. A síntese nunca lê fontes; ampliar o vault é só da
  descoberta. Fonte nova sempre volta ao humano.
- **Identidade sem colisão:** `SRC` é atribuído uma vez, ao registrar a fonte; a evidência é
  `EV-<sessão>-<seq>` — `<sessão>` garante unicidade entre runs, `<seq>` é sequencial na sessão.
- Apêndice, nunca sobrescrita em `sources.json`/`state.json`; evidências são imutáveis.
- Proteção de notas validadas por humano.
- Substrato é **neutro**: nenhuma opinião de método aqui (bounded context, MVP, agregado…).
