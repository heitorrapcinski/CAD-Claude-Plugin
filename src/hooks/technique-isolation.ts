// technique-isolation.ts — hook PreToolUse (Write|Edit).
//
// Reforça o princípio 3 (isolamento por técnica — não-misturar). Lê o module.json
// das técnicas e bloqueia (exit 2) se:
//   (a) o módulo ativo (env CAD_ACTIVE_TECHNIQUE) escreve fora da sua pasta_saida; ou
//   (b) o conteúdo de um artefato de técnica contém termo do vocabulario_proibido.
// Sem técnica ativa declarada, associa o destino pela pasta e ainda assim aplica
// o veto de vocabulário. Zero dependências em runtime.
//
// Aprofundamento sob demanda (seção 5.1/10): durante um /cad:synthesize, quem
// escreve o substrato (docs/cad/) são os skills de DESCOBERTA, não o módulo. O
// orquestrador sinaliza esse passo com env CAD_APROFUNDAMENTO — só então uma
// escrita em docs/cad/ com técnica ativa é liberada (ator = descoberta). Sem esse
// sinal, um skill de MÓDULO escrevendo no substrato é a violação que o hook existe
// para impedir, e é bloqueado.

import { loadAllContracts, outputPrefix, ModuleContract } from "../lib/manifest.js";

interface ToolInput {
  file_path?: string;
  content?: string;
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

function isLetter(c: string): boolean {
  return c !== "" && /\p{L}/u.test(c);
}

/** Presença do termo como "palavra": fronteira à esquerda; permite plural -s. */
function containsWord(hay: string, needle: string): boolean {
  let from = 0;
  for (;;) {
    const i = hay.indexOf(needle, from);
    if (i < 0) return false;
    const before = i > 0 ? hay[i - 1] : "";
    const end = i + needle.length;
    const after = end < hay.length ? hay[end] : "";
    const after2 = end + 1 < hay.length ? hay[end + 1] : "";
    const leftOk = !isLetter(before);
    const rightOk = !isLetter(after) || (after === "s" && !isLetter(after2));
    if (leftOk && rightOk) return true;
    from = i + needle.length;
  }
}

/** Quebra "agregado / aggregate (qualificador)" em termos buscáveis. */
function tokenize(entry: string): string[] {
  return entry
    .split("/")
    .map((s) => s.replace(/\(.*?\)/g, "").trim())
    .filter((s) => s.length >= 2);
}

function forbiddenHits(content: string, forbidden: string[]): string[] {
  const hay = content.toLowerCase();
  const hits: string[] = [];
  for (const entry of forbidden) {
    for (const tok of tokenize(entry)) {
      if (containsWord(hay, tok.toLowerCase())) {
        hits.push(tok);
        break;
      }
    }
  }
  return hits;
}

/**
 * Passo de aprofundamento em curso: a escrita atual no substrato é feita pelos
 * skills de descoberta a mando do /cad:synthesize (ator = descoberta), não por um
 * skill de módulo. Sinalizado pelo orquestrador via env CAD_APROFUNDAMENTO.
 */
function isDeepeningFlow(): boolean {
  const v = process.env.CAD_APROFUNDAMENTO;
  return v === "1" || v === "true" || v === "yes";
}

function block(rel: string, reason: string, hits: string[]): never {
  process.stderr.write(
    `[CAD] technique-isolation: ${reason} — ${rel} (princípio 3).\n` +
      (hits.length ? `Termos proibidos encontrados: ${hits.join(", ")}\n` : ""),
  );
  process.exit(2);
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
  if (!rel) process.exit(0);

  const content =
    typeof ti.content === "string"
      ? ti.content
      : typeof ti.new_string === "string"
        ? ti.new_string
        : "";

  const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT ?? process.cwd();
  const contracts = loadAllContracts(pluginRoot);
  if (contracts.length === 0) process.exit(0);

  const active = process.env.CAD_ACTIVE_TECHNIQUE;
  let contract: ModuleContract | undefined;

  if (active) {
    contract = contracts.find((c) => c.tecnica === active);
    if (contract) {
      const prefix = outputPrefix(contract);
      // (a) módulo ativo escrevendo fora da própria pasta_saida.
      if (!rel.startsWith(prefix + "/")) {
        if (rel.startsWith("docs/cad/")) {
          // Substrato neutro: NÃO é território de módulo. Só a descoberta pode
          // escrevê-lo, e apenas durante o aprofundamento sob demanda (seção 5.1).
          if (isDeepeningFlow()) process.exit(0); // ator = descoberta: permitido
          // ator = módulo tentando escrever o substrato → violação do princípio 3.
          block(
            rel,
            `módulo ativo "${active}" tentou escrever no substrato (docs/cad/) — ` +
              `só a descoberta escreve o substrato (aprofundamento sob demanda)`,
            [],
          );
        }
        block(
          rel,
          `escrita fora de pasta_saida (${contract.pasta_saida}) do módulo ativo "${active}"`,
          [],
        );
      }
    }
  } else {
    // sem técnica ativa declarada: associa pelo destino da escrita.
    contract = contracts.find((c) => rel.startsWith(outputPrefix(c) + "/"));
  }

  if (!contract) process.exit(0); // fora de qualquer pasta de técnica conhecida

  // (b) veto de vocabulário de outra técnica no artefato.
  const hits = forbiddenHits(content, contract.vocabulario_proibido);
  if (hits.length > 0) {
    block(rel, `vocabulário de outra técnica em artefato de "${contract.tecnica}"`, hits);
  }

  process.exit(0);
}

void main();
