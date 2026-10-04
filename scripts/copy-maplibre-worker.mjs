// MapLibre GL v6 loads its web worker relative to its own module URL, which
// bundlers rewrite. We serve the worker (and the chunk it imports) from
// /public under a versioned path and point the library at it at runtime.
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkgDir = join(root, "node_modules", "maplibre-gl");
const { version } = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
const outRoot = join(root, "public", "vendor", "maplibre");
const out = join(outRoot, version);

if (existsSync(outRoot)) {
  for (const entry of readdirSync(outRoot)) if (entry !== version) rmSync(join(outRoot, entry), { recursive: true });
}
mkdirSync(out, { recursive: true });
for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  copyFileSync(join(pkgDir, "dist", file), join(out, file));
}
console.log(`maplibre-gl ${version} worker copied to public/vendor/maplibre/${version}`);
