---
name: cad-doc-backlog
description: Gerencia docs/cad/backlog.md — lacunas e conflitos pendentes de validação humana, marcados por consumidor (cad ou a técnica). Único registro do que falta. Invocado por /cad:discovery, /cad:synthesize e /cad:backlog.
---

# cad-doc-backlog — Backlog de Pendências (substrato neutro)

## Objetivo

Manter a fila de **pendências**: lacunas de conhecimento e conflitos de definição
que precisam de validação humana. A coluna **Consumidor** separa lacunas de
descoberta (`cad`) de lacunas de síntese de uma técnica (`lean-inception`, `ddd`).

## Entradas

- `/cad:discovery` — abre `lacuna` e `conflito_definição` do substrato.
- `/cad:synthesize` — abre lacunas com `consumidor: <técnica>`.
- `/cad:backlog` — lê para apresentar; fecha itens ao receber resposta humana.

## Template (copiar fielmente)

```markdown
# Backlog de Pendências

| ID | Tipo | Consumidor | Lacuna/Conflito | Artefato afetado | Status | Resposta | Fonte resposta | Data |
|---|---|---|---|---|---|---|---|---|
| BL-003 | lacuna | cad | Quais permissões da capacidade "Aprovação"? | capabilities.md | aberto | — | — | — |
| BL-004 | conflito_definição | cad | "Aprovação": normativo 2 alçadas vs. código 1 | vocabulary.md | aberto | — | — | — |
| BL-009 | lacuna | lean-inception | Falta a proposta do MVP1 | lean-inception/mvp-canvas.md | aberto | — | — | — |
```

Tipos: `lacuna`, `conflito_definição`, `conflito_pós_validação`.
Consumidor: `cad` ou o nome programático da técnica (`lean-inception`, `ddd`, …).

## Como preencher

- `ID` sequencial `BL-NNN`. `Artefato afetado` é o arquivo a corrigir (no substrato
  ou em `docs/<técnica>/`).
- `conflito_definição`: divergência entre fontes no substrato. `conflito_pós_validação`:
  fonte nova conflita com um bloco **já validado por humano** — nunca sobrescreva o
  bloco; registre o conflito aqui.
- `Status` começa `aberto`. Ao ser resolvido por `/cad:backlog`, preencha
  `Resposta`, `Fonte resposta` (`validação consultor — [data]`) e `Data`, e mude
  o status para resolvido.
- Lacuna de uma técnica recebe `Consumidor: <técnica>`, sinalizando que é
  pendência de **síntese**, não de descoberta (regra do contrato de módulo).
