// build.mjs — compila os hooks TypeScript em artefatos .cjs autossuficientes.
//
// O CAD não tem servidor MCP: o que se compila são apenas os 3 hooks (que
// importam os helpers de src/lib). Cada hook vira um build/hooks/<hook>.cjs
// com as dependências inlined (bundle: true), de modo que o plugin é
// distribuído SEM node_modules e SEM npm install no destino.
//
// A versão é injetada em build via define __PKG_VERSION__, garantindo fonte
// única no package.json (princípio de proveniência).

import { build } from "esbuild";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf8"),
);

const hooks = [
  "src/hooks/validate-evidence.ts",
  "src/hooks/validate-obsidian-syntax.ts",
  "src/hooks/protect-human-validation.ts",
  "src/hooks/technique-isolation.ts",
];

// Helpers determinísticos (seção 11.3). São inlined nos hooks que os importam,
// mas também são emitidos como artefatos próprios — "compila os hooks E os
// helpers" — úteis para invocação direta (dev) e auditoria.
const helpers = ["src/lib/state.ts", "src/lib/manifest.ts"];

await build({
  entryPoints: [...hooks, ...helpers].map((f) => resolve(__dirname, f)),
  outbase: resolve(__dirname, "src"),
  outdir: resolve(__dirname, "build"),
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node18",
  outExtension: { ".js": ".cjs" },
  define: {
    __PKG_VERSION__: JSON.stringify(pkg.version),
  },
  logLevel: "info",
});

console.log(`✓ build concluído — hooks v${pkg.version} em build/hooks/*.cjs`);
