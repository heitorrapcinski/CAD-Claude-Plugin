// state.ts — append determinístico em .cad-plugin/state.json e sources.json.
//
// Princípio 8 (apêndice, nunca sobrescrita): toda sessão e toda fonte são
// ADICIONADAS; o histórico nunca é perdido. Cada escrita carimba plugin_versao
// com __PKG_VERSION__ (injetado em build, fonte única no package.json — seção
// 11.5), para auditabilidade ponta a ponta. Zero dependências em runtime.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

// Injetado por esbuild via define: { __PKG_VERSION__: ... }.
declare const __PKG_VERSION__: string;
export const PLUGIN_VERSION: string =
  typeof __PKG_VERSION__ !== "undefined" ? __PKG_VERSION__ : "0.0.0-dev";

export interface SessionEntry {
  sessao: number;
  data: string;
  comando: string;
  foco: string;
  resultado: string;
}

export interface State {
  sessao_atual: number;
  plugin_versao: string;
  ultima_atualizacao: string;
  /** Nº de notas abertas em docs/knowledge-vault/11 Investigations (lacunas/conflitos pendentes). */
  investigacoes_abertas: number;
  historico: SessionEntry[];
}

export interface SourceEntry {
  id: string;
  caminho: string;
  tipo: "Normativo" | "Corporativo" | "Código" | "Informal";
  sessao: number;
  data: string;
}

export interface Sources {
  fontes: SourceEntry[];
}

function readJson<T>(path: string, fallback: T): T {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    return fallback;
  }
}

// Serialização determinística: indentação fixa de 2 espaços, ordem de inserção.
function writeJson(path: string, value: unknown): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n", "utf8");
}

/** Adiciona uma sessão ao histórico (nunca sobrescreve) e carimba a versão. */
export function appendSession(
  statePath: string,
  entry: SessionEntry,
  investigacoesAbertas: number,
): State {
  const state = readJson<State>(statePath, {
    sessao_atual: 0,
    plugin_versao: PLUGIN_VERSION,
    ultima_atualizacao: entry.data,
    investigacoes_abertas: 0,
    historico: [],
  });
  state.historico.push(entry);
  state.sessao_atual = entry.sessao;
  state.ultima_atualizacao = entry.data;
  state.investigacoes_abertas = investigacoesAbertas;
  state.plugin_versao = PLUGIN_VERSION;
  writeJson(statePath, state);
  return state;
}

/** Adiciona uma fonte (mesma fonte pode reaparecer em sessões distintas). */
export function appendSource(sourcesPath: string, entry: SourceEntry): Sources {
  const sources = readJson<Sources>(sourcesPath, { fontes: [] });
  sources.fontes.push(entry);
  writeJson(sourcesPath, sources);
  return sources;
}
