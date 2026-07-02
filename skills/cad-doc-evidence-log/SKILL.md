---
name: cad-doc-evidence-log
description: Gerencia docs/cad/evidence-log.md — a tabela imutável de evidências rastreáveis (EV-XXX) que sustenta todo fato do CAD. Cria entradas por append, inclusive as de "Validação Humana" geradas por /cad:backlog.
---

# cad-doc-evidence-log — Log de Evidências (substrato neutro)

## Objetivo

Manter o **registro central de evidências** (`EV-XXX`) que dá rastreabilidade a
todo o sistema: cada fato no knowledge-base, vocabulário, regras, capacidades e
em qualquer artefato de técnica referencia uma linha desta tabela.

## Entradas

- Fontes escaneadas por `/cad:discovery`.
- Respostas do consultor em `/cad:backlog` (geram evidência de validação humana).
- Releituras de **aprofundamento sob demanda** disparadas por `/cad:synthesize`
  (relê um trecho de fonte **já autorizada** apontado por um `EV`, gravando o
  detalhe fino como evidência nova — seção 5.1).

## Template (seção 8.1 — copiar fielmente)

```markdown
# Log de Evidências

| ID | Afirmação (resumo) | Fonte | Localização | Tipo de fonte | Sessão | Data |
|---|---|---|---|---|---|---|
| EV-014 | Aprovação exige 2 alçadas | normativo_credito_v3.pdf | Seção 4.2 | Normativo | 2 | 2026-06-22 |
| EV-015 | Código implementa 1 alçada | credito/service.py | L142-160 | Código | 1 | 2026-06-20 |
| EV-090 | Classe Proposta tem os campos valor, cpf, periodo _(aprofundamento)_ | credito/service.py | L142-160 | Código | 4 | 2026-06-26 |
```

Tipos de fonte: `Normativo`, `Corporativo`, `Código`, `Informal`, `Validação Humana`.

## Como preencher

- **Append-only.** Novas evidências são sempre **adicionadas**; nunca edite nem
  remova linhas existentes (o histórico de evidências é imutável).
- `ID` sequencial `EV-NNN`. `Localização` precisa o trecho (seção do normativo,
  intervalo de linhas do código, página do documento).
- `Afirmação (resumo)` é uma **paráfrase curta**, não cópia literal da fonte.
- Para `/cad:backlog`, registre `Tipo de fonte: Validação Humana` e `Fonte:
  "validação consultor — [data]"`. Esta evidência é a **mais forte** (princípio 5)
  e supera a hierarquia normativa para o ponto resolvido.
- **Evidência de aprofundamento (seção 5.1):** quando a evidência nasce de uma
  releitura de aprofundamento (fonte **já autorizada**, apontada por um `EV`
  anterior), **marque-a visivelmente** para auditoria — anexe a observação
  `_(aprofundamento)_` ao final da `Afirmação (resumo)`. Mantém o `Tipo de fonte`
  real (`Código`, `Normativo`…), pois a fonte é a mesma; a marca só sinaliza a
  **origem** (síntese que releu detalhe fino), não uma fonte nova.
- A `EV-XXX` criada aqui é o alvo dos marcadores `[Fonte: EV-XXX]` espalhados pelo
  substrato e pelos artefatos de técnica.
