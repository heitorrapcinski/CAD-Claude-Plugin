// validate-evidence.ts — hook PostToolUse (Write|Edit).
//
// Reforça o princípio 1 (sem evidência, sem afirmação): em arquivos
// docs/cad/*.md e docs/<técnica>/*.md, todo bloco factual (item de lista ou linha
// de tabela de dados) precisa citar uma evidência — [Fonte: EV-XXX], → EV-XXX —
// ou marcar pendência — [⚠️ Pendente: BL-XXX]. Se faltar, bloqueia (exit 2) e
// devolve o motivo. Sem dependências em runtime.

import { readFileSync, existsSync } from "node:fs";

interface HookInput {
  tool_name?: string;
  tool_input?: {
    file_path?: string;
    content?: string;
    new_string?: string;
  };
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

// Marcadores de citação aceitos: EV-### , BL-### ou "Pendente".
const CITED = /(EV-[\w-]+)|(BL-[\w-]+)|(Pendente)/i;

/** Um bloco é factual se tem item de lista ou linha de dados de tabela. */
function isFactual(block: string[]): boolean {
  for (const raw of block) {
    const l = raw.trim();
    if (l === "" || l.startsWith(">") || /^#{1,6}\s/.test(l)) continue;
    if (l.startsWith("|")) {
      if (/^\|[\s:|-]+\|?$/.test(l)) continue; // separador |---|
      return true;
    }
    if (/^[-*]\s+/.test(l) || /^\d+\.\s+/.test(l)) return true;
  }
  return false;
}

function findUncitedFactualBlocks(content: string): string[] {
  const lines = content.split(/\r?\n/);

  // neutraliza regiões em cerca de código (``` ... ```)
  const clean: string[] = [];
  let inFence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      clean.push("");
      continue;
    }
    clean.push(inFence ? "" : line);
  }

  // agrupa em blocos separados por linha em branco
  const blocks: string[][] = [];
  let cur: string[] = [];
  for (const line of clean) {
    if (line.trim() === "") {
      if (cur.length) {
        blocks.push(cur);
        cur = [];
      }
    } else {
      cur.push(line);
    }
  }
  if (cur.length) blocks.push(cur);

  const offenders: string[] = [];
  for (const block of blocks) {
    if (!isFactual(block)) continue;
    if (!CITED.test(block.join("\n"))) {
      const first = block.find((l) => l.trim().length > 0) ?? "";
      offenders.push(first.trim().slice(0, 100));
    }
  }
  return offenders;
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
  // filtro: docs/cad/*.md e docs/*/*.md  ->  docs/<dir>/<arquivo>.md
  if (!rel || !/^docs\/[^/]+\/[^/]+\.md$/.test(rel)) process.exit(0);

  // PostToolUse: o arquivo já foi gravado — lê do disco para ver o conteúdo final.
  const content = existsSync(fp)
    ? readFileSync(fp, "utf8")
    : input.tool_input?.content ?? input.tool_input?.new_string ?? "";

  const offenders = findUncitedFactualBlocks(content);
  if (offenders.length > 0) {
    process.stderr.write(
      `[CAD] validate-evidence: bloco factual sem evidência em ${rel} (princípio 1).\n` +
        `Todo bloco factual precisa de [Fonte: EV-XXX] ou [⚠️ Pendente: BL-XXX].\n` +
        `Blocos sem citação:\n` +
        offenders.map((b) => "  • " + b).join("\n") +
        "\n",
    );
    process.exit(2);
  }
  process.exit(0);
}

void main();
