// build.mjs — compila os hooks TypeScript em artefatos .cjs autossuficientes.
//
// O CAD não tem servidor MCP: o que se compila são apenas os 3 hooks (que
// importam os helpers de src/lib). Cada hook vira um build/hooks/<hook>.cjs
// com as dependências inlined (bundle: true), de modo que o plugin é
// distribuído SEM node_modules e SEM npm install no destino.
//
// A versão é injetada em build via define __PKG_VERSION__, garantindo fonte
// única no package.json (princípio de proveniência — seção 11.5 da spec).

import { build } from "esbuild";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf8"),
);

const hooks = [
  "validate-evidence",
  "protect-human-validation",
  "technique-isolation",
];

await build({
  entryPoints: hooks.map((h) => resolve(__dirname, `src/hooks/${h}.ts`)),
  outdir: resolve(__dirname, "build/hooks"),
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
