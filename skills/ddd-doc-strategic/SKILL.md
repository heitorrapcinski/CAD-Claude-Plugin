---
name: ddd-doc-strategic
description: Gera os três artefatos estratégicos do DDD — subdomains.md (Core/Supporting/Generic), bounded-contexts.md (contextos + módulos de código + acoplamento) e context-map.md (padrões ACL/OHS/Shared Kernel/…) — em docs/ddd/, lendo só o substrato CAD. Fiel a Eric Evans.
---

# ddd-doc-strategic — DDD Estratégico

## Objetivo

Produzir o **design estratégico** do DDD: classificar **subdomínios** (espaço do
problema), delimitar **bounded contexts** (espaço da solução, mapeados ao código)
e desenhar o **mapa de contextos** (padrões de integração). A classificação é
**interpretação do método**, não descoberta crua.

## Entradas

Lê **apenas** o substrato CAD: `capabilities.md` (→ subdomínios/contextos),
`knowledge-base.md`, `business-rules.md`, `vocabulary.md` e `evidence-log.md`.
Escreve apenas em `docs/ddd/`.

## Templates (seção 8.3 — copiar fielmente)

### `subdomains.md` — Subdomínios (Core / Supporting / Generic)

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

### `bounded-contexts.md` — Bounded contexts mapeados ao código

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

### `context-map.md` — Mapa de Contextos (padrões de integração)

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

## Como preencher

- **Subdomínios:** `Core` (diferenciador), `Supporting` (apoia o core, específico),
  `Generic` (commodity). Ligue cada um às `CAP-XXX` de `capabilities.md`.
  Classificação incerta → `[⚠️ Pendente: BL-XXX]` (consumidor: `ddd`).
- **Bounded contexts:** mapeie a **módulos/pacotes de código** com `[Fonte: EV-XXX]`;
  descreva responsabilidade **e o que NÃO resolve**; registre o **acoplamento
  observado** com evidência; fronteira duvidosa → `Limite incerto`.
- **Mapa de contextos:** use **apenas** os padrões válidos listados; "contextos
  compartilhados" são **Shared Kernel**. Relacionamento não confirmado vira
  pendência.
- Toda linha factual cita `EV-XXX`; nada de inferência silenciosa.
- **Lacuna de detalhe fino → aprofundamento (seção 5.1).** Diante de uma lacuna que
  um `EV` já aponta (ex.: falta o mapeamento de código de um contexto), **não infira
  em silêncio nem leia a fonte**: sinalize a lacuna com o **ponteiro de `EV`** para o
  orquestrador aprofundar (releitura só de fonte já autorizada). Fonte nova →
  `[⚠️ Pendente: BL-XXX]` (consumidor: `ddd`).
- **Vocabulário proibido:** nada de termos exclusivos da Lean (`MVP`, `persona`,
  `jornada` sentido Lean, `onda`/`sequenciador`, `é-não é-faz-não faz`) nem do Event
  Storming (`hotspot`, `evento-pivô`). Vocabulário compartilhado com o ES
  (`aggregate`, `domain event`, `command`, `policy`, `read model`, `bounded context`)
  é permitido.
