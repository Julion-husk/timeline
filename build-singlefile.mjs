// Assemble a single, self-contained, double-clickable HTML file from the
// validated multi-file project. Three.js is loaded as a UMD global (r128) so
// the page works straight from file:// with no server or build step.
import { readFileSync, writeFileSync } from "fs";

const css = readFileSync("css/style.css", "utf8");
const strip = (s) => s.replace(/^export /gm, "").replace(/^import .*$/gm, "");
let data = strip(readFileSync("src/data.js", "utf8"));
let audio = strip(readFileSync("src/audio.js", "utf8"));
let timeline = readFileSync("src/timeline.js", "utf8")
  .replace(/^import .*$/gm, "")
  // Version-proof the curve calls (use the return value, not the optional-target
  // arg) so the same logic runs on the older UMD build too.
  .replace("curve.getPointAt(clamp(u, 0, 1), outP);", "outP.copy(curve.getPointAt(clamp(u, 0, 1)));")
  .replace("curve.getTangentAt(clamp(u, 0, 1), outT).normalize();", "outT.copy(curve.getTangentAt(clamp(u, 0, 1))).normalize();");

let html = readFileSync("index.html", "utf8");

// inline the stylesheet
html = html.replace(
  '<link rel="stylesheet" href="./css/style.css" />',
  `<style>\n${css}\n</style>`
);

// inline a UMD global build of Three.js — fully self-contained: no CDN, no
// modules, so the one file works identically on file:// and over any URL.
const threeUMD = readFileSync("vendor/three.umd.min.js", "utf8");
html = html.replace(
  /<!-- Three\.js[\s\S]*?<\/script>/,
  `<script>/* Three.js r128 (UMD, MIT License) — inlined so this file needs no network */\n${threeUMD}\n</script>`
);

// swap the module entry point for one inline, non-module script
html = html.replace(
  '<script type="module" src="./src/timeline.js"></script>',
  `<script>\n/* ===== data ===== */\n${data}\n/* ===== audio ===== */\n${audio}\n/* ===== timeline ===== */\n${timeline}\n</script>`
);

writeFileSync("river-of-sound.html", html);
console.log("Wrote river-of-sound.html (" + (html.length / 1024).toFixed(0) + " KB)");
console.log("export/import left over:",
  (html.match(/^\s*export /gm) || []).length, "exports,",
  (html.match(/^\s*import /gm) || []).length, "imports (should be 0/0)");
