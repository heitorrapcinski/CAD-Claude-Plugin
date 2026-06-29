// package.mjs — zipa o pacote distribuível build/cad-claude-plugin.plugin.
//
// O .plugin contém apenas o necessário para instalar via "Fazer upload de
// plugin local" (Code, Cowork e Chat): o manifesto, as skills (Markdown +
// module.json), os hooks (declaração + binários compilados) e o README.
// NÃO há .mcpb nem injeção de mcpServers — o CAD não tem servidor MCP.
//
// Pré-requisito: rodar `npm run build` antes (o script `package` já encadeia).

import AdmZip from "adm-zip";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = __dirname;
const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));

const compiledHooks = resolve(root, "build/hooks");
if (!existsSync(compiledHooks)) {
  console.error(
    "✗ build/hooks não encontrado. Rode `npm run build` antes de empacotar.",
  );
  process.exit(1);
}

const outName = `${pkg.name}.plugin`;
const outPath = resolve(root, "build", outName);

const zip = new AdmZip();

// Manifesto do plugin.
zip.addLocalFile(resolve(root, ".claude-plugin/plugin.json"), ".claude-plugin");

// Skills (Markdown + module.json dos módulos de técnica).
zip.addLocalFolder(resolve(root, "skills"), "skills");

// Hooks: declaração (hooks.json) + binários compilados (build/hooks/*.cjs).
zip.addLocalFolder(resolve(root, "hooks"), "hooks");
zip.addLocalFolder(compiledHooks, "build/hooks");

// README.
zip.addLocalFile(resolve(root, "README.md"), "");

if (!existsSync(resolve(root, "build"))) mkdirSync(resolve(root, "build"));
zip.writeZip(outPath);

console.log(`✓ pacote gerado: build/${outName} (v${pkg.version})`);
