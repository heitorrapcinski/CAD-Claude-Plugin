// protect-human-validation.ts — hook PreToolUse (Write|Edit) em docs/**/*.md.
//
// Reforça o princípio 7 (conteúdo validado por humano é protegido): bloqueia a
// remoção/sobrescrita de um bloco cuja origem é "validação humana", fora do fluxo
// /cad:backlog. O fluxo de backlog — único autorizado a alterar um bloco validado
// (ex.: conflito_pós_validação) — sinaliza-se via env CAD_BACKLOG_FLOW. Sem
// dependências em runtime.

import { readFileSync, existsSync } from "node:fs";

interface ToolInput {
  file_path?: string;
  content?: string;
  old_string?: string;
  new_string?: string;
}

interface HookInput {
  tool_name?: string;
  tool_input?: ToolInput;
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

function docsRelative(p: string): string | null {
  const norm = p.replace(/\\/g, "/");
  const m = /(?:^|\/)(docs\/.*)$/.exec(norm);
  return m ? m[1] : null;
}

// Origem "validação humana": frase de fonte/resolução no corpo OU marca no frontmatter
// do vault (`source: "validação humana…"` / `status: validated`).
const HUMAN =
  /(valida[çc][ãa]o\s+(humana|consultor|do\s+consultor))|(resolu[çc][ãa]o\s+humana)|(^\s*status:\s*validated\s*$)/i;

function isBacklogFlow(): boolean {
  const v = process.env.CAD_BACKLOG_FLOW;
  return v === "1" || v === "true" || v === "yes";
}

/** Conteúdo resultante da operação, para comparar com o atual. */
function computeNext(existing: string, ti: ToolInput): string {
  if (typeof ti.content === "string") return ti.content; // Write: substitui tudo
  if (typeof ti.old_string === "string" && typeof ti.new_string === "string") {
    return existing.split(ti.old_string).join(ti.new_string); // Edit: aplica a troca
  }
  return existing;
}

async function main(): Promise<void> {
  let input: HookInput;
  try {
    input = JSON.parse(await readStdin()) as HookInput;
  } catch {
    process.exit(0);
  }

  const ti = input.tool_input ?? {};
  const fp = ti.file_path;
  if (!fp) process.exit(0);

  const rel = docsRelative(fp);
  if (!rel || !/^docs\/.*\.md$/.test(rel)) process.exit(0); // docs/**/*.md
  if (!existsSync(fp)) process.exit(0); // arquivo novo: nada a proteger

  if (isBacklogFlow()) process.exit(0); // alteração deliberada via /cad:backlog

  const existing = readFileSync(fp, "utf8");
  const protectedLines = existing
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && HUMAN.test(l));
  if (protectedLines.length === 0) process.exit(0);

  const next = computeNext(existing, ti);
  const removed = protectedLines.filter((l) => !next.includes(l));
  if (removed.length > 0) {
    process.stderr.write(
      `[CAD] protect-human-validation: tentativa de remover/sobrescrever bloco ` +
        `validado por humano em ${rel} (princípio 7).\n` +
        `Use /cad:backlog para alterar blocos de origem "validação humana".\n` +
        `Linhas protegidas afetadas:\n` +
        removed.map((l) => "  • " + l.slice(0, 100)).join("\n") +
        "\n",
    );
    process.exit(2);
  }
  process.exit(0);
}

void main();
