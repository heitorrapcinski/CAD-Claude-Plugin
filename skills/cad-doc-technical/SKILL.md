---
name: cad-doc-technical
description: Gera as notas de Knowledge das pastas 05 Source Code (como foi implementado), 06 Data (que informações manipula), 07 Integrations (com quem se comunica) e 08 Operational Architecture (como opera em produção) do vault docs/cad/ — engenharia reversa de código, dados, integrações e arquitetura operacional. Notas Zettelkasten rastreadas por evidência. Invocado por /cad:discovery e /cad:backlog.
---

# cad-doc-technical — Source Code · Data · Integrations · Operational Architecture (05–08)

## Objetivo

Produzir as notas da **camada de implementação e operação** do System of Record:

- **`05 Source Code`** — *"como foi implementado?"* engenharia reversa do código.
- **`06 Data`** — *"que informações o sistema manipula?"* dados e armazenamento.
- **`07 Integrations`** — *"com quem o sistema se comunica?"* integrações internas/externas.
- **`08 Operational Architecture`** — *"como opera em produção?"* deploy, runtime, monitoração.

Segue as [convenções do vault](../cad-doc-conventions/SKILL.md). Diferente de
`03 Structural`/`04 Behavioral` (conceito/comportamento neutros), aqui a nota **descreve a
implementação** — mas ainda é substrato **neutro de método** (nada de DDD/C4/TOGAF).

## Entradas

- Fontes escaneadas por `/cad:discovery` (código, DDL/SQL, arquivos de config/IaC, specs
  de API, documentação de operação).
- Notas de `09 Evidence` (para ligar via `source:`).

## Pastas e notas

- **`05 Source Code/`** — por projeto/pacote/módulo (`Login Module.md`), classe, interface,
  método importante, framework, padrão encontrado, dependência entre módulos.
- **`06 Data/`** — por tabela (`TB_CLIENTE.md`), view, procedure, esquema, arquivo, modelo
  de dados, estrutura de armazenamento e relações.
- **`07 Integrations/`** — uma nota por sistema externo/serviço (`Receita Federal.md`,
  `Kafka.md`, `SMTP.md`), com protocolo, formato e dependências.
- **`08 Operational Architecture/`** — organize por subárea (Compute, Network, Storage,
  Database, Middleware, Configuration, Secrets, Security, Deployment, Runtime, Monitoring,
  Logging, Scheduling, Backup & Recovery, High Availability, Disaster Recovery, Capacity,
  Performance, Dependencies).

## Template de nota

### Módulo de código (05)

```markdown
---
title: Billing Module
tags: [modulo, codigo]
type: module
status: confirmed
source: "[[EV-041]]"
author: CAD Discovery
created: 2026-07-10
---

# Billing Module

**Responsabilidade:** cálculo e emissão de cobranças.
**Entradas:** [[Proposta]] aprovada.
**Saídas:** [[Documento]] de cobrança.
**Dependências:** [[Notification Module]], [[TB_DOCUMENTO]].

## Principais classes / métodos
- `BillingService.emitir()` — …
```

### Tabela (06)

```markdown
---
title: TB_CLIENTE
aliases: [Tabela de Clientes]
tags: [tabela, dados]
type: table
status: confirmed
source: "[[EV-050]]"
author: CAD Discovery
created: 2026-07-10
---

# TB_CLIENTE

Persiste os dados de [[Cliente]].

## Colunas (relevantes)
- Identificador, nome, situação.

## Relacionamentos
- [[Cliente]] é persistido em [[TB_CLIENTE]]
- `1..n` [[TB_DOCUMENTO]]
```

## Como preencher

- Cada nota de `05 Source Code` responde: **responsabilidade, entradas, saídas,
  dependências, principais classes/métodos**.
- **Anti-PII:** exemplos de dados só de validação/default/máscara/fixture/sintético —
  nunca dado real.
- Toda nota confirmada/inferida traz `source:` → `09 Evidence` (para código, o `EV` guarda
  o caminho + intervalo de linhas via `SRC`). Sem evidência, abra `11 Investigations`.
- Diagramas de arquitetura/dados vão em `12 Views` e são referenciados por `[[...]]`.
- **Vocabulário proibido:** nada de conceitos de técnica (agregado, repositório no sentido
  DDD, bounded context, camada anticorrupção…). Descreva a implementação como ela é.
