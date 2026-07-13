---
name: ddd-doc-strategic
description: Gera os três artefatos estratégicos do DDD — subdomains.md (Core/Supporting/Generic), bounded-contexts.md (contextos + módulos de código + acoplamento) e context-map.md (padrões ACL/OHS/Shared Kernel/…) — em docs/ddd/, lendo só o substrato CAD (Knowledge Vault). Fiel a Eric Evans.
---

# ddd-doc-strategic — DDD Estratégico

## Objetivo

Produzir o **design estratégico** do DDD: classificar **subdomínios** (espaço do
problema), delimitar **bounded contexts** (espaço da solução, mapeados ao código)
e desenhar o **mapa de contextos** (padrões de integração). A classificação é
**interpretação do método**, não descoberta crua.

## Entradas

Lê **apenas** o substrato CAD (Knowledge Vault): as **capacidades**
(`02 Business Knowledge/` → subdomínios/contextos), os **módulos de código**
(`05 Source Code/` → mapeamento dos contextos), os **conceitos/regras**
(`03 Structural Knowledge/`, `02 Business Knowledge/`) e as notas de **evidência**
(`09 Evidence/`). Conflitos/lacunas vêm de `11 Investigations/`. Escreve apenas em
`docs/ddd/`.

Cada bloco factual cita a evidência **pelo título completo da nota**, com o código como
exibição — `[[EV-5-014 · Risco de crédito é core|EV-5-014]]` — e referencia as notas
do substrato por **nome** (`[[Capacidade - …]]`, `[[Regra - …]]`).

## Templates (copiar fielmente)

### `subdomains.md` — Subdomínios (Core / Supporting / Generic)

```markdown
# Subdomínios — [Domínio]

| Subdomínio | Tipo | Descrição | Capacidade(s) relacionada(s) | Evidência |
|---|---|---|---|---|
| Análise de risco de crédito | Core | diferencial competitivo do negócio | [[Capacidade - Análise de risco de crédito]] | [[EV-5-014 · Risco é core|EV-5-014]] |
| Notificação ao cliente | Supporting | necessário, mas não diferenciador | [[Capacidade - Notificação ao cliente]] | [[EV-5-015 · Notificação apoia o core|EV-5-015]] |
| Autenticação | Generic | resolvido por solução de mercado | [[Capacidade - Autenticação]] | [[EV-5-016 · Auth via lib de mercado|EV-5-016]] |

> Tipo: **Core** (diferenciador, foco do investimento) · **Supporting** (apoia o
> core, específico do negócio) · **Generic** (commodity, candidato a comprar/terceirizar).
> Classificação incerta vira [⚠️ Pendente: [[Investigação - …]]] (consumidor: ddd).
```

### `bounded-contexts.md` — Bounded contexts mapeados ao código

```markdown
# Bounded Contexts — [Sistema]

## Contexto: [Nome do Contexto]
- **Subdomínio relacionado:** [...] (→ subdomains.md)
- **Responsabilidade:** [o que este contexto resolve e o que NÃO resolve]
- **Módulos/pacotes de código:** [ex.: [[Billing Module]], [[credito (pacote)]]] [[EV-5-020 · Billing isola cobrança|EV-5-020]]
- **Linguagem ubíqua:** → ubiquitous-language.md#[contexto]
- **Acoplamento observado:** baixo | médio | alto — [evidência do acoplamento] [[EV-5-021 · Acoplamento Billing↔Cadastro|EV-5-021]]
- **Limite incerto:** [⚠️ Pendente: [[Investigação - Fronteira do contexto …]]] — [o que falta para confirmar]
```

### `context-map.md` — Mapa de Contextos (padrões de integração)

```markdown
# Mapa de Contextos — [Sistema]

| Upstream (montante) | Downstream (jusante) | Padrão de relacionamento | Evidência |
|---|---|---|---|
| Crédito | Notificação | Customer/Supplier | [[EV-5-015 · Notificação apoia o core|EV-5-015]] |
| Sistema Legado | Crédito | Anticorruption Layer (ACL) | [[EV-5-030 · Adapter isola o legado|EV-5-030]] |
| Crédito | Cobrança | Shared Kernel (modelo de "Fatura" compartilhado) | [[EV-5-031 · Fatura compartilhada|EV-5-031]] |
| Pagamentos | (externo) | Open Host Service + Published Language | [[EV-5-005 · API pública de pagamentos|EV-5-005]] |

> Padrões válidos: Partnership · Shared Kernel · Customer/Supplier · Conformist ·
> Anticorruption Layer (ACL) · Open Host Service (OHS) · Published Language ·
> Separate Ways · Big Ball of Mud.
> "Contextos compartilhados" (pergunta do insight) aparecem como **Shared Kernel**.
> Relacionamento não confirmado: [⚠️ Pendente: [[Investigação - …]]] (consumidor: ddd).
```

## Como preencher

- **Subdomínios:** `Core` (diferenciador), `Supporting` (apoia o core, específico),
  `Generic` (commodity). Ligue cada um à nota `[[Capacidade - …]]` de `02 Business Knowledge`.
  Classificação incerta → `[⚠️ Pendente: [[Investigação - …]]]` (consumidor: `ddd`).
- **Bounded contexts:** mapeie a **módulos/pacotes de código** (notas de `05 Source Code`)
  citando `[[EV-…|EV-…]]`; descreva responsabilidade **e o que NÃO resolve**; registre o
  **acoplamento observado** com evidência; fronteira duvidosa → `Limite incerto`.
- **Mapa de contextos:** use **apenas** os padrões válidos listados; "contextos
  compartilhados" são **Shared Kernel**. Relacionamento não confirmado vira pendência.
- Toda linha factual cita a evidência por wikilink; nada de inferência silenciosa.
- **Faltou no vault → investigação, nunca releitura de fonte.** Se um fato necessário não
  está no substrato (ex.: o mapeamento de código de um contexto), **não infira em silêncio**:
  abra uma nota em `11 Investigations` (`tags: consumidor/ddd`) e marque
  `[⚠️ Pendente: [[Investigação - …]]]` no artefato. A descoberta (`/cad:discovery`) é quem
  amplia o vault; a síntese nunca relê a fonte.
- **Vocabulário proibido:** nada de termos exclusivos da Lean (`MVP`, `persona`,
  `jornada` sentido Lean, `onda`/`sequenciador`, `é-não é-faz-não faz`) nem do Event
  Storming (`hotspot`, `evento-pivô`). Vocabulário compartilhado com o ES
  (`aggregate`, `domain event`, `command`, `policy`, `read model`, `bounded context`)
  é permitido.
