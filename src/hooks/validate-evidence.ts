// validate-evidence.ts — hook PostToolUse (Write|Edit).
//
// Reforça o princípio "sem evidência, sem afirmação". Opera em dois modos:
//
//   (1) Vault Zettelkasten — docs/cad/**/*.md (Knowledge Base rastreável). Toda nota
//       precisa de frontmatter YAML, e as notas de conhecimento precisam de um campo
//       `source:` não-vazio (a rastreabilidade agora vive no frontmatter, apontando
//       para uma nota de 09 Evidence). Exceções (fonte opcional): as pastas de
//       navegação/representação/backlog — "11 Investigations", "12 Views" e "13 MOCs".
//
//   (2) Legado por técnica — docs/<técnica>/*.md (módulos ainda não migrados ao vault).
//       Mantém o cheque inline: todo bloco factual precisa citar [Fonte: EV-XXX],
//       → EV-XXX, ou marcar pendência [⚠️ Pendente: BL-XXX].
//
// Se faltar, bloqueia (exit 2) e devolve o motivo. Sem dependências em runtime.

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

// ── Modo 1: vault Zettelkasten (docs/cad/**) ──────────────────────────────────

// Pastas do vault isentas do campo `source:` (índices, visões, backlog de dúvidas).
const SOURCE_EXEMPT = new Set(["11 Investigations", "12 Views", "13 MOCs"]);

/** Linhas do bloco de frontmatter YAML no topo, ou null se não houver. */
function frontmatterLines(content: string): string[] | null {
  const lines = content.split(/\r?\n/);
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;
  if (lines[i]?.trim() !== "---") return null;
  const fm: string[] = [];
  for (let j = i + 1; j < lines.length; j++) {
    if (lines[j].trim() === "---") return fm;
    fm.push(lines[j]);
  }
  return null; // abertura sem fechamento
}

/**
 * A chave `source` tem valor? Aceita duas formas do YAML:
 *   - inline escalar:  `source: "[[EV-…]]"`
 *   - lista YAML:      `source:` seguido de itens indentados `  - "[[EV-…]]"`
 * (Vários links numa mesma string não funcionam no Obsidian — por isso a lista.)
 */
function hasSourceValue(fm: string[]): boolean {
  for (let i = 0; i < fm.length; i++) {
    const m = /^source:(.*)$/.exec(fm[i]);
    if (!m) continue;
    const inline = m[1].trim().replace(/^["']|["']$/g, "").trim();
    if (inline !== "") return true;
    // sem valor inline → procura itens indentados (lista) logo abaixo
    for (let j = i + 1; j < fm.length; j++) {
      const line = fm[j];
      if (line.trim() === "") continue; // linha em branco dentro do bloco
      if (/^\s+\S/.test(line)) {
        const t = line.trim().replace(/^-\s*/, "").replace(/^["']|["']$/g, "").trim();
        if (t !== "") return true; // item de lista com conteúdo
      } else {
        break; // próxima chave de topo → bloco de source vazio
      }
    }
    return false;
  }
  return false;
}

/** Pasta imediatamente sob docs/cad/ (ex.: "03 Structural Knowledge"). */
function vaultFolder(rel: string): string {
  const rest = rel.slice("docs/cad/".length);
  const slash = rest.indexOf("/");
  return slash < 0 ? "" : rest.slice(0, slash);
}

/** Retorna o motivo de violação da nota de vault, ou null se estiver ok. */
function vaultViolation(rel: string, content: string): string | null {
  const fm = frontmatterLines(content);
  if (fm === null) {
    return "nota do vault sem frontmatter YAML (--- no topo)";
  }
  if (SOURCE_EXEMPT.has(vaultFolder(rel))) return null;
  if (!hasSourceValue(fm)) {
    return 'nota de conhecimento sem `source:` no frontmatter (aponte para uma nota de 09 Evidence — escalar `source: "[[EV-…]]"` ou lista YAML de links)';
  }
  return null;
}

// ── Modo 2: legado por técnica (docs/<técnica>/*.md) ──────────────────────────

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
  if (!rel || !rel.endsWith(".md")) process.exit(0);

  const isVault = rel.startsWith("docs/cad/");
  // legado: docs/<dir>/<arquivo>.md (exatamente um nível), fora de docs/cad/.
  const isLegacyTechnique = !isVault && /^docs\/[^/]+\/[^/]+\.md$/.test(rel);
  if (!isVault && !isLegacyTechnique) process.exit(0);

  // PostToolUse: o arquivo já foi gravado — lê do disco para ver o conteúdo final.
  const content = existsSync(fp)
    ? readFileSync(fp, "utf8")
    : input.tool_input?.content ?? input.tool_input?.new_string ?? "";

  if (isVault) {
    const reason = vaultViolation(rel, content);
    if (reason) {
      process.stderr.write(
        `[CAD] validate-evidence: ${reason} em ${rel}.\n` +
          `No vault Zettelkasten, a rastreabilidade vive no frontmatter: toda nota de\n` +
          `conhecimento (01–10) precisa de \`source:\` apontando para uma nota de 09 Evidence.\n` +
          `Sem evidência, não afirme — crie uma nota em 11 Investigations.\n`,
      );
      process.exit(2);
    }
    process.exit(0);
  }

  // modo legado por técnica
  const offenders = findUncitedFactualBlocks(content);
  if (offenders.length > 0) {
    process.stderr.write(
      `[CAD] validate-evidence: bloco factual sem evidência em ${rel} (artefato de técnica legado).\n` +
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
