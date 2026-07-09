// manifest.ts — leitura do contrato module.json de cada módulo de técnica.
//
// Usa apenas a stdlib do Node e JSON.parse nativo — zero dependências em runtime.
// É consumido pelo hook de isolamento por técnica e pelo orquestrador cad-synthesize
// para validar entradas/saídas e vocabulário proibido.

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Política de aprofundamento sob demanda:
 *   "fontes-autorizadas" → a síntese pode reler uma fonte já autorizada
 *      (registrada em sources.json), apontada por um EV, para extrair detalhe fino;
 *   "nao" → sem releitura automática (a técnica trabalha no nível de produto).
 * Fonte nova sempre volta ao humano (backlog), qualquer que seja o valor.
 */
export type PodeAprofundar = "nao" | "fontes-autorizadas";

export interface ModuleContract {
  /** nome programático da técnica (ex.: "lean-inception", "ddd") */
  tecnica: string;
  /** nome completo do método, só para prosa */
  metodo_de_origem: string;
  /**
   * política de aprofundamento sob demanda (ver PodeAprofundar). Opcional para
   * compatibilidade com contratos antigos; ausência é tratada como "nao"
   * (conservador) por `canDeepen`.
   */
  pode_aprofundar?: PodeAprofundar;
  /** única pasta onde o módulo escreve (ex.: "docs/lean-inception/") */
  pasta_saida: string;
  /** únicos arquivos do substrato que o módulo lê */
  entradas_substrato: string[];
  /** artefatos que o módulo produz */
  artefatos: string[];
  /** termos de outras técnicas barrados nestes artefatos */
  vocabulario_proibido: string[];
}

/** Carrega e parseia um module.json. Lança se o JSON for inválido. */
export function loadContract(path: string): ModuleContract {
  return JSON.parse(readFileSync(path, "utf8")) as ModuleContract;
}

/**
 * Carrega todos os contratos do plugin (skills/<x>-module/module.json).
 * Contratos malformados são ignorados (não derrubam o hook).
 */
export function loadAllContracts(pluginRoot: string): ModuleContract[] {
  const skillsDir = join(pluginRoot, "skills");
  if (!existsSync(skillsDir)) return [];
  const contracts: ModuleContract[] = [];
  for (const entry of readdirSync(skillsDir)) {
    if (!entry.endsWith("-module")) continue;
    const manifestPath = join(skillsDir, entry, "module.json");
    if (!existsSync(manifestPath)) continue;
    try {
      contracts.push(loadContract(manifestPath));
    } catch {
      // contrato inválido: ignora em vez de bloquear o fluxo
    }
  }
  return contracts;
}

/** Normaliza a pasta_saida para um prefixo sem barra final (ex.: "docs/ddd"). */
export function outputPrefix(contract: ModuleContract): string {
  return contract.pasta_saida.replace(/\/+$/, "");
}

/**
 * Se o módulo permite aprofundamento sob demanda (releitura de fonte já
 * autorizada). Ausência do campo é tratada como "nao" (modo conservador).
 */
export function canDeepen(contract: ModuleContract): boolean {
  return contract.pode_aprofundar === "fontes-autorizadas";
}
