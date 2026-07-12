// validate-obsidian-syntax.ts — hook PostToolUse (Write|Edit).
//
// Lint incremental de armadilhas de sintaxe do Obsidian que quebram o render ou o
// grafo SILENCIOSAMENTE — o Obsidian raramente acusa "erro de sintaxe"; ele só
// renderiza diferente do pretendido, e você só descobre olhando. NÃO valida "a
// linguagem toda" (não há gramática formal, e quase tudo é aceito): é uma coleção
// CURADA de invariantes de alta precisão (quase zero falso-positivo), cada uma uma
// função (lines) => Violacao[]. Some novas regras à lista RULES conforme novos bugs
// aparecerem — o custo de um falso-positivo aqui é bloquear uma escrita legítima
// (exit 2), então só entra regra que quebra de verdade E é precisa.
//
// Regras atuais:
//   1. pipe-em-tabela      — [[wikilink|alias]] com | não escapado dentro de célula
//      de tabela. Em tabela Markdown o | é separador de coluna: o link quebra e as
//      colunas deslocam. O correto é escapar: [[título\|código]].
//   2. wikilink-nao-fechado — [[ ou ![[ sem o ]] correspondente na mesma linha.
//   3. frontmatter-nao-fechado — bloco --- aberto no topo e nunca fechado (some tudo).
//   4. cerca-nao-fechada   — cerca de código ``` com contagem ímpar (não fechada).
//
// Escopo: docs/**/*.md (vault + artefatos de técnica). PostToolUse: lê o arquivo
// final do disco. Achou violação → bloqueia (exit 2) e devolve o motivo para o
// próprio Claude corrigir. Zero dependências em runtime.

import { readFileSync, existsSync } from "node:fs";

interface HookInput {
  tool_name?: string;
  tool_input?: {
    file_path?: string;
    content?: string;
    new_string?: string;
  };
}

interface Violacao {
  regra: string;
  linha: number; // 1-based
  trecho: string;
  dica: string;
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

/** Caminho relativo a partir do segmento "docs/", ou null se não houver. */
function docsRelative(p: string): string | null {
  const norm = p.replace(/\\/g, "/");
  const m = /(?:^|\/)(docs\/.*)$/.exec(norm);
  return m ? m[1] : null;
}

/** Conjunto de índices (0-based) de linhas dentro de cerca de código ```…```. */
function fencedLines(lines: string[]): Set<number> {
  const set = new Set<number>();
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) {
      set.add(i); // a própria linha de cerca não é conteúdo de nota
      inFence = !inFence;
      continue;
    }
    if (inFence) set.add(i);
  }
  return set;
}

/** Linha de tabela de conteúdo (começa com | e não é o separador |---|). */
function isTableRow(raw: string): boolean {
  const t = raw.trim();
  if (!t.startsWith("|")) return false;
  if (/^\|[\s:|-]+\|?$/.test(t)) return false; // separador |---|
  return true;
}

// ── Regra 1: pipe não escapado em wikilink dentro de tabela ───────────────────
function ruleTablePipe(lines: string[], fenced: Set<number>): Violacao[] {
  const out: Violacao[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (fenced.has(i) || !isTableRow(lines[i])) continue;
    for (const m of lines[i].matchAll(/!?\[\[[^\]]*\]\]/g)) {
      const inner = m[0].replace(/^!?\[\[/, "").replace(/\]\]$/, "");
      if (/(^|[^\\])\|/.test(inner)) {
        out.push({
          regra: "pipe-em-tabela",
          linha: i + 1,
          trecho: m[0],
          dica: "escape o pipe do alias: [[título\\|código]] (em tabela, | é separador de coluna)",
        });
      }
    }
  }
  return out;
}

// ── Regra 2: wikilink/embed não fechado ───────────────────────────────────────
function ruleUnclosedWikilink(lines: string[], fenced: Set<number>): Violacao[] {
  const out: Violacao[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (fenced.has(i)) continue;
    // remove código inline e links completos; o que sobrar não deveria ter [[ nem ]]
    const rest = lines[i]
      .replace(/`[^`]*`/g, " ")
      .replace(/!?\[\[[^\]]*\]\]/g, " ");
    if (rest.includes("[[") || rest.includes("]]")) {
      out.push({
        regra: "wikilink-nao-fechado",
        linha: i + 1,
        trecho: lines[i].trim().slice(0, 100),
        dica: "feche o wikilink com ]] (links do Obsidian não podem cruzar linhas)",
      });
    }
  }
  return out;
}

// ── Regra 3: frontmatter aberto e não fechado ─────────────────────────────────
function ruleUnclosedFrontmatter(lines: string[]): Violacao[] {
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;
  if (lines[i]?.trim() !== "---") return []; // nota sem frontmatter: não é problema aqui
  for (let j = i + 1; j < lines.length; j++) {
    if (lines[j].trim() === "---") return []; // fechado
  }
  return [
    {
      regra: "frontmatter-nao-fechado",
      linha: i + 1,
      trecho: "--- (abertura sem fechamento)",
      dica: "feche o bloco de frontmatter com uma linha --- antes do corpo",
    },
  ];
}

// ── Regra 4: cerca de código não fechada ──────────────────────────────────────
function ruleUnclosedFence(lines: string[]): Violacao[] {
  const fences: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) fences.push(i);
  }
  if (fences.length % 2 === 0) return [];
  const last = fences[fences.length - 1];
  return [
    {
      regra: "cerca-nao-fechada",
      linha: last + 1,
      trecho: lines[last].trim().slice(0, 100),
      dica: "feche a cerca de código com uma linha ``` correspondente",
    },
  ];
}

/** Roda todas as regras e devolve as violações encontradas. */
function lint(content: string): Violacao[] {
  const lines = content.split(/\r?\n/);
  const fenced = fencedLines(lines);
  return [
    ...ruleTablePipe(lines, fenced),
    ...ruleUnclosedWikilink(lines, fenced),
    ...ruleUnclosedFrontmatter(lines),
    ...ruleUnclosedFence(lines),
  ].sort((a, b) => a.linha - b.linha);
}

async function main(): Promise<void> {
  let input: HookInput;
  try {
    input = JSON.parse(await readStdin()) as HookInput;
  } catch {
    process.exit(0);
  }

  const fp = input.tool_input?.file_path;
  if (!fp) process.exit(0);

  const rel = docsRelative(fp);
  if (!rel || !rel.endsWith(".md")) process.exit(0);

  // PostToolUse: o arquivo já foi gravado — lê do disco para ver o conteúdo final.
  const content = existsSync(fp)
    ? readFileSync(fp, "utf8")
    : input.tool_input?.content ?? input.tool_input?.new_string ?? "";

  const violacoes = lint(content);
  if (violacoes.length === 0) process.exit(0);

  process.stderr.write(
    `[CAD] validate-obsidian-syntax: sintaxe do Obsidian que quebra o render em ${rel}.\n` +
      violacoes
        .map((v) => `  • L${v.linha} [${v.regra}]: ${v.trecho}\n    → ${v.dica}`)
        .join("\n") +
      "\n",
  );
  process.exit(2);
}

void main();
