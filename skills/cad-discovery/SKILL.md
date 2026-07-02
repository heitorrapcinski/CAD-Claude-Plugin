---
name: cad-discovery
description: Orquestrador /cad:discovery — escaneia exatamente as fontes indicadas pelo consultor e popula o substrato neutro (docs/cad/) com fatos rastreáveis por evidência, abrindo backlog para tudo que não tiver fonte clara. Não gera nenhum artefato de técnica.
argument-hint: "[fontes...]  (ex.: credito/ normativo_credito_v3.pdf)"
---

# /cad:discovery — Descoberta sobre o substrato neutro

## Objetivo

Escanear **somente** as fontes que o consultor passou e popular/atualizar o
**substrato neutro** em `docs/cad/`: base de conhecimento, log de evidências,
vocabulário, regras de negócio e capacidades. Tudo que não tem evidência clara
vira item de backlog. **Este comando nunca gera artefato de técnica** (nada em
`docs/lean-inception/`, `docs/ddd/`, etc.).

## Entradas

- **Argumento `[fontes]`** — lista explícita de caminhos (arquivos ou pastas) e/ou
  normativos a escanear nesta sessão. Se vazio, **pergunte** ao consultor quais
  fontes escanear; **nunca** rescaneie por conta própria fontes de sessões
  anteriores (princípio 6 — escopo de scan é sempre humano).
- `.cad-plugin/state.json` e `.cad-plugin/sources.json` (se existirem) — para
  saber a sessão atual e o histórico. Se não existirem, crie-os.

## Procedimento

1. **Registrar fontes.** Para cada fonte do argumento, faça **append** em
   `.cad-plugin/sources.json` (nunca sobrescreva — princípio 8) uma entrada com
   `id` (`SRC-NNN`), `caminho`, `tipo` (`Normativo` | `Corporativo` | `Código` |
   `Informal`), `sessao` e `data`. Uma mesma fonte pode reaparecer em sessões
   diferentes se revisitada explicitamente. Incremente a sessão em `state.json`.
2. **Escanear apenas essas fontes** com as ferramentas nativas (Read/Grep/Glob).
   Não saia do escopo declarado.
3. **Extrair fatos com evidência.** Para cada afirmação que a fonte sustenta:
   - Crie a evidência via **`cad-doc-evidence-log`** (gera `EV-NNN`, com fonte,
     localização, tipo de fonte e sessão).
   - Registre o fato parafraseado (nunca cópia literal) via
     **`cad-doc-knowledge-base`**, citando `→ evidence-log.md#EV-NNN`.
   - Conforme o conteúdo, alimente também **`cad-doc-vocabulary`** (termos +
     conflitos), **`cad-doc-business-rules`** (regras) e
     **`cad-doc-capabilities`** (capacidades).
4. **Aplicar a regra de evidência** (seção 6 da spec):
   - Sem evidência clara → **não afirme, não assuma** → abra item em
     `cad-doc-backlog` (`tipo: lacuna`, `consumidor: cad`).
   - Definições conflitantes entre fontes → aplique a **hierarquia de fontes**
     (Normativo > Corporativo > Código > Informal): registre a definição
     priorizada **e todos os conflitos**, e abra `tipo: conflito_definição`.
   - Bloco já validado por humano → **nunca sobrescreva** (princípio 7); um
     conflito novo abre `tipo: conflito_pós_validação`.
5. **Não tocar em nenhuma pasta de técnica.** Discovery escreve só em `docs/cad/`.

## Saída ao final

Atualize `state.json` (append no `historico`, contagem de `backlog_abertos`) e
**exiba a lista de IDs de backlog abertos** (de descoberta) para apoiar a decisão
do consultor sobre quando o substrato está "rico o bastante" para sintetizar uma
técnica (princípio/seção 7). Mostre também um resumo de cobertura: fontes
escaneadas, evidências criadas, fatos/regras/capacidades adicionados.

## Regras inegociáveis

- Sem evidência, sem afirmação (princípio 1).
- Escopo humano: só as fontes passadas (princípio 6).
- Apêndice, nunca sobrescrita em `sources.json`/`state.json` (princípio 8).
- Proteção de blocos validados por humano (princípio 7).
- Substrato é **neutro**: nenhuma opinião de método aqui (princípio 2).
