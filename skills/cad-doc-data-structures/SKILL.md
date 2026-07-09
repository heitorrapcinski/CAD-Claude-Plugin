---
name: cad-doc-data-structures
description: Gerencia docs/cad/data-structures.md — estruturas de dados do domínio (campos, valores enumerados, exemplos de preenchimento, formato/tamanho derivado e relações com multiplicidade), em nível conceitual/lógico e neutro (sem tipos técnicos, tabelas ou FKs). Ponte para entidades/objetos de valor (DDD), read models (Event Storming) e funcionalidades (Lean). Invocado por /cad:discovery e /cad:backlog.
---

# cad-doc-data-structures — Estruturas de Dados (substrato neutro)

## Objetivo

Inventariar as **estruturas de dados** que o domínio manipula — quais campos um
conceito carrega, seus valores enumerados, **exemplos de preenchimento**, o
**formato/tamanho** derivado desses exemplos e as **relações** entre estruturas
(multiplicidade `1..1`, `1..n`, `0..n`). É a ponte natural para as **entidades e
objetos de valor** do DDD (`aggregates.md`), os **read models** do Event Storming e
as **funcionalidades** da Lean — mas aqui fica **descritiva e neutra**, em nível
**conceitual/lógico**, sem modelagem de método e **sem contaminação de tecnologia**.

## Entradas

- Fontes escaneadas por `/cad:discovery` — tipicamente `tipo: Código` (classes,
  validações, defaults, fixtures), mas também documentação/normativos que descrevam
  os dados de um conceito (formulários, tabelas de campos).
- `docs/cad/evidence-log.md` — cada estrutura/campo cita uma `EV-XXX`.

## Template (seção 8.1 — copiar fielmente)

```markdown
# Estruturas de Dados — [Domínio/Subdomínio]

## Estrutura: [Nome no domínio, ex.: Ticket]
- **Campos:** título, descrição, tipo, status, urgência, impacto, prioridade [Fonte: EV-XXX]
- **Valores enumerados:** status ∈ {New, Assigned, Planned, Pending, Solved, Closed} [Fonte: EV-XXX]
- **Exemplos de preenchimento:** título "Impressora sem toner"; prioridade "3"; aberto_em "2026-06-30 14:22" [Fonte: EV-XXX]
- **Formato/tamanho (derivado dos exemplos):** título — texto até ~255 caracteres; aberto_em — AAAA-MM-DD hh:mm; cpf — ###.###.###-## (11 dígitos) [Fonte: EV-XXX]
- **Relações:** Ticket 1..N Follow-up; Ticket 1..1 Solicitante; Ticket 0..N Watcher [Fonte: EV-XXX]
- **Pendência:** [⚠️ Pendente: BL-XXX] — [campo/relação/exemplo não confirmado]
> **Nota de fronteira:** agrupamento e relações **observados na fonte**; ownership e
> fronteira de modelo (agregado/entidade/VO) são decisão da **técnica**, não deste substrato.
```

## Como preencher

- Uma seção `## Estrutura: [Nome]` por conceito de domínio; o **Nome** é o termo do
  domínio (não o nome de tabela/classe). Toda linha factual carrega `[Fonte: EV-XXX]`
  ou `[⚠️ Pendente: BL-XXX]`.
- **Nível conceitual/lógico, nunca físico.** A regra-mestra: entra o que descreve o
  dado do domínio; fica de fora o que é decisão de armazenamento/tecnologia.

| Manter (conceitual + lógico) | Descartar (físico / tecnologia) |
|---|---|
| Campos em **termos de domínio** | Tipos técnicos (`varchar`, `int`, `datetime`, `bool`), nullability-schema |
| Valores enumerados do domínio | Nome de tabela/coluna verbatim, namespace, nome de classe |
| **Exemplos de preenchimento** (sintéticos / de regra de validação) | **Dados reais de produção** como exemplo (risco de PII) |
| **Formato/máscara/tamanho derivados** do exemplo | `VARCHAR(n)`, precisão/escala de storage |
| **Relações com multiplicidade** (`1..1`, `1..n`, `0..n`) | FK, tabela-pivô, índice, mecanismo de join |
| Nota de fronteira (agrupamento é só observação) | Ownership / fronteira de agregado (é da técnica) |

- **Exemplos no lugar de tipos.** Não registre o tipo técnico do campo; registre um
  **exemplo de valor** e derive dele máscara/tamanho/formato (ex.: `"123.456.789-00"`
  → `###.###.###-##`, 11 dígitos). O exemplo é fato observável; a máscara é derivação
  descritiva; o "tipo" fica como conclusão de quem consome (o DDD dirá "isto é um
  objeto de valor CPF").
- **Trava anti-PII.** A fonte legítima de um exemplo é: regra de validação/regex no
  código, valor default, máscara declarada, fixture de teste, ou exemplo **sintético**
  que satisfaça a regra. **Nunca** copie um valor de dado real de produção para o
  substrato. Sem exemplo seguro disponível → deixe só o campo e a `[⚠️ Pendente: BL-XXX]`.
- **Relações são fato observado.** Registre a multiplicidade conceitual
  (`1..N Follow-up`), citando `EV`. **Não** importe o mecanismo (FK, tabela-pivô) nem
  decida ownership/fronteira — isso é da técnica. A **Nota de fronteira** deixa isso
  explícito em cada estrutura.
- Estrutura/campo/relação **sem evidência não entra** — vira `lacuna` no backlog
  (`consumidor: cad`, ou `consumidor: <técnica>` quando a lacuna só importa para a
  síntese daquela técnica).
- **Sem vocabulário de técnica** aqui — nada de "entidade", "objeto de valor",
  "agregado", "read model". Isso é interpretação dos módulos, feita em
  `docs/<técnica>/`. Aqui é só "estrutura de dados", "campo", "relação".
- Bloco resolvido por humano é protegido (princípio 7); só `/cad:backlog` altera.
