---
name: event-storming-doc-flows
description: Gera docs/event-storming/flows.md — as fatias da gramática do Event Storming (Ator → Comando → Agregado → Evento → Read Model → Política), com comandos no imperativo e eventos no passado. Lê só o substrato CAD. Fiel a Alberto Brandolini.
---

# event-storming-doc-flows — Fluxos (fatias da gramática)

## Objetivo

Descer da linha do tempo ao **nível de design**: para cada comando principal,
montar a **fatia** completa da gramática de Brandolini — **Ator → Comando →
Agregado → Evento(s) de domínio → Read Model → Política**. É onde a mecânica do
fluxo fica explícita.

## Entradas

Lê **apenas** o substrato CAD (Knowledge Vault): `04 Behavioral Knowledge/` (fluxos e
comandos), `02 Business Knowledge/` (regras → políticas), `03 Structural Knowledge/`
(agregados/read models) e as notas de **evidência** (`09 Evidence/`). Usa a `timeline.md`
(deste módulo) como referência dos eventos. Escreve apenas em `docs/event-storming/`.

## Template (copiar fielmente)

```markdown
# Fluxos — [Processo]

> Cada fatia: **Ator → Comando → Agregado → Evento(s) de domínio → Read Model →
> Política**. Comando no imperativo; evento no passado.

## Fatia: [comando principal]
- **Ator:** [quem dispara] [[EV-5-080 · Ator do comando|EV-5-080]]
- **Comando:** [Registrar Pedido] (imperativo) [[EV-5-081 · Endpoint de registro|EV-5-081]]
- **Agregado:** [Pedido] — recebe o comando e garante a consistência [[EV-5-082 · Classe Pedido|EV-5-082]]
- **Evento(s):** [Pedido Registrado] (→ timeline.md) [[EV-5-071 · POST /orders|EV-5-071]]
- **Read model (decisão):** [dado consultado antes de decidir] [[EV-5-083 · View de saldo|EV-5-083]] | [⚠️ Pendente: [[Investigação - Read model da decisão …]]]
- **Política (reação):** "sempre que [Pagamento Aprovado] → [Faturar Pedido]"
  ([[Regra - Faturar após pagamento]]) [[EV-5-084 · Regra de faturamento|EV-5-084]]
```

## Como preencher

- Uma seção `## Fatia:` por comando principal. **Comando no imperativo**
  (`Registrar Pedido`); **evento no passado** (`Pedido Registrado`).
- **Política** referencia a nota de regra de origem por wikilink
  (`[[Regra - Faturar após pagamento]]`) e cita `[[EV-…|EV-…]]` — é a ponte com o substrato.
- **Read model** é o dado consultado **antes de decidir**; se não há evidência de
  qual dado embasa a decisão, marque `[⚠️ Pendente: [[Investigação - …]]]`.
- **Faltou no vault → investigação, nunca releitura de fonte.** Se falta saber qual
  agregado recebe o comando: **não infira em silêncio nem leia a fonte** — abra uma nota em
  `11 Investigations` (`tags: consumidor/event-storming`) e marque
  `[⚠️ Pendente: [[Investigação - …]]]`.
- **Vocabulário proibido:** nada de termos exclusivos da Lean ou só-DDD (`objeto de
  valor`, `repositório`, `linguagem ubíqua`, `subdomínio`, `ACL/OHS/mapa de
  contextos`). `aggregate`, `command`, `policy`, `read model`, `domain event` são
  compartilhados e permitidos.
