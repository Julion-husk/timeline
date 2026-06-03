/*
 * THE RIVER OF SOUND — main application
 * ------------------------------------------------------------
 * A scroll-driven 3D journey down a glowing "river" whose waveform morphs
 * to the character of each era of Black music. Built with Three.js (vendored).
 */

import * as THREE from "three";
import { ERAS, EPIGRAPH, LENSES, listenURL } from "./data.js";
import { AudioEngine } from "./audio.js";

const N = ERAS.length;
const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ *
 *  Small helpers
 * ------------------------------------------------------------------ */
const $ = (sel) => document.querySelector(sel);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (t) => t * t * (3 - 2 * t);

// Pre-parse the era colors into THREE.Color objects.
const COL = ERAS.map((e) => ({
  bg: new THREE.Color(e.colors.bg),
  accent: new THREE.Color(e.colors.accent),
  accent2: new THREE.Color(e.colors.accent2),
}));

const audio = new AudioEngine();

/* ------------------------------------------------------------------ *
 *  WebGL boot — fall back gracefully to a readable document
 * ------------------------------------------------------------------ */
let renderer;
try {
  const testCanvas = document.createElement("canvas");
  const ok = window.WebGLRenderingContext &&
    (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl"));
  if (!ok) throw new Error("no-webgl");
  renderer = new THREE.WebGLRenderer({ canvas: $("#scene"), antialias: true, alpha: false });
} catch (err) {
  document.body.classList.add("no-webgl");
  buildFallback();
}

/* ================================================================== *
 *  3D SCENE
 * ================================================================== */
let scene, camera, curve, totalLen;
let waveGeo, waveLine, wavePoints, lineMat, ptsMat;
let nodeSprites = [];
let stars;
const U0 = 0.035, U1 = 0.965;           // keep the camera off the very ends
const SAMPLES = 2000;                    // resolution of the waveform ribbon
const WIDTH = 3.1;                       // world-space amplitude scale
let base = null;                         // precomputed per-sample geometry data

const tmpP = new THREE.Vector3();
const tmpT = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const tmpN = new THREE.Vector3();
const WORLD_UP = new THREE.Vector3(0, 1, 0);
const camPos = new THREE.Vector3();
const camLook = new THREE.Vector3();

function frameAt(u, outP, outT, outB) {
  curve.getPointAt(clamp(u, 0, 1), outP);
  curve.getTangentAt(clamp(u, 0, 1), outT).normalize();
  outB.crossVectors(outT, WORLD_UP);
  if (outB.lengthSq() < 1e-6) outB.set(1, 0, 0);
  outB.normalize();
}

function initScene() {
  scene = new THREE.Scene();
  scene.background = COL[0].bg.clone();
  scene.fog = new THREE.FogExp2(COL[0].bg.clone(), 0.0095);

  camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 3000);

  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  buildCurve();
  buildWave();
  buildNodes();
  buildStars();

  addEventListener("resize", onResize);
}

// A meandering river path that flows away from the camera (+Z) while
// swaying in X and gently rising/falling in Y.
function buildCurve() {
  const pts = [];
  const M = N * 2 + 4;
  for (let i = 0; i <= M; i++) {
    const z = i * 26;
    const x = Math.sin(i * 0.62) * 17 + Math.sin(i * 0.21) * 7;
    const y = Math.sin(i * 0.43) * 4.2 + Math.cos(i * 0.17) * 2;
    pts.push(new THREE.Vector3(x, y, z));
  }
  curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
  curve.arcLengthDivisions = 3000;
  totalLen = curve.getLength();
}

// Map a sample index -> the interpolated era parameters at that point.
function eraParamsAtP(p) {
  const ePos = clamp(p * N - 0.5, 0, N - 1);
  const i0 = Math.floor(ePos);
  const i1 = Math.min(i0 + 1, N - 1);
  const f = smoothstep(ePos - i0);
  const a = ERAS[i0].wave, b = ERAS[i1].wave;
  return {
    amp: lerp(a.amp, b.amp, f),
    freq: lerp(a.freq, b.freq, f),
    sharp: lerp(a.sharp, b.sharp, f),
    jitter: lerp(a.jitter, b.jitter, f),
    swell: lerp(a.swell, b.swell, f),
    speed: lerp(a.speed, b.speed, f),
  };
}

function buildWave() {
  // Precompute the static skeleton: base point, side direction, arc length,
  // and the (static) interpolated wave parameters for every sample.
  base = {
    px: new Float32Array(SAMPLES), py: new Float32Array(SAMPLES), pz: new Float32Array(SAMPLES),
    bx: new Float32Array(SAMPLES), by: new Float32Array(SAMPLES), bz: new Float32Array(SAMPLES),
    arc: new Float32Array(SAMPLES),
    amp: new Float32Array(SAMPLES), freq: new Float32Array(SAMPLES), sharp: new Float32Array(SAMPLES),
    jitter: new Float32Array(SAMPLES), swell: new Float32Array(SAMPLES), speed: new Float32Array(SAMPLES),
  };
  for (let j = 0; j < SAMPLES; j++) {
    const t = j / (SAMPLES - 1);
    const u = lerp(U0, U1, t);
    frameAt(u, tmpP, tmpT, tmpB);
    base.px[j] = tmpP.x; base.py[j] = tmpP.y; base.pz[j] = tmpP.z;
    base.bx[j] = tmpB.x; base.by[j] = tmpB.y; base.bz[j] = tmpB.z;
    base.arc[j] = u * totalLen;
    const pr = eraParamsAtP(t);
    base.amp[j] = pr.amp; base.freq[j] = pr.freq; base.sharp[j] = pr.sharp;
    base.jitter[j] = pr.jitter; base.swell[j] = pr.swell; base.speed[j] = pr.speed;
  }

  waveGeo = new THREE.BufferGeometry();
  waveGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(SAMPLES * 3), 3));

  lineMat = new THREE.LineBasicMaterial({
    color: COL[0].accent.clone(), transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  waveLine = new THREE.Line(waveGeo, lineMat);
  waveLine.frustumCulled = false;
  scene.add(waveLine);

  ptsMat = new THREE.PointsMaterial({
    color: COL[0].accent2.clone(), map: glowTexture(), size: 2.4, sizeAttenuation: true,
    transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  wavePoints = new THREE.Points(waveGeo, ptsMat);
  wavePoints.frustumCulled = false;
  scene.add(wavePoints);

  updateWave(0); // prime positions
}

// Recompute the living waveform for the current time.
function updateWave(time) {
  const pos = waveGeo.attributes.position.array;
  for (let j = 0; j < SAMPLES; j++) {
    const x = base.arc[j] * base.freq[j] * 0.22 + time * base.speed[j];
    const s = Math.sin(x);
    const shaped = (1 - base.sharp[j]) * s + base.sharp[j] * Math.tanh(s * 3) * 0.92;
    const env = (1 - base.swell[j] * 0.5) +
      base.swell[j] * 0.5 * (0.5 + 0.5 * Math.sin(base.arc[j] * 0.06 + time * 0.5));
    const jit = base.jitter[j] * Math.sin(x * 5.3 + base.arc[j] * 1.7) * 0.5;
    const w = (shaped * env + jit) * base.amp[j] * WIDTH;
    const k = j * 3;
    pos[k]     = base.px[j] + base.bx[j] * w;
    pos[k + 1] = base.py[j] + w * 0.26;
    pos[k + 2] = base.pz[j] + base.bz[j] * w;
  }
  waveGeo.attributes.position.needsUpdate = true;
}

// Glowing station markers at each era's center.
function buildNodes() {
  const tex = glowTexture();
  ERAS.forEach((era, i) => {
    const u = lerp(U0, U1, (i + 0.5) / N);
    frameAt(u, tmpP, tmpT, tmpB);
    const mat = new THREE.SpriteMaterial({
      map: tex, color: COL[i].accent.clone(), transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9,
    });
    const sp = new THREE.Sprite(mat);
    sp.position.set(tmpP.x, tmpP.y + 0.5, tmpP.z);
    sp.scale.setScalar(9);
    sp.userData.baseScale = 9;
    scene.add(sp);
    nodeSprites.push(sp);
  });
}

// A drifting starfield for depth, spanning the whole river volume.
function buildStars() {
  const COUNT = REDUCE ? 600 : 2600;
  const geo = new THREE.BufferGeometry();
  const arr = new Float32Array(COUNT * 3);
  const zmax = totalLen;
  for (let i = 0; i < COUNT; i++) {
    arr[i * 3]     = (Math.random() - 0.5) * 220;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 140 + 10;
    arr[i * 3 + 2] = Math.random() * (zmax + 200) - 60;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xbfd4ff, map: glowTexture(), size: 1.5, sizeAttenuation: true,
    transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  stars = new THREE.Points(geo, mat);
  stars.frustumCulled = false;
  scene.add(stars);
}

// Soft radial-gradient sprite used everywhere we want a neon glow.
let _glow = null;
function glowTexture() {
  if (_glow) return _glow;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0.0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.85)");
  grad.addColorStop(0.55, "rgba(255,255,255,0.25)");
  grad.addColorStop(1.0, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  _glow = new THREE.CanvasTexture(c);
  return _glow;
}

function onResize() {
  if (!renderer) return;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}

/* ================================================================== *
 *  SCROLL + RENDER LOOP
 * ================================================================== */
let pTarget = 0, pSmooth = 0, lastActive = -1, lastTime = 0;
const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

function maxScroll() {
  return Math.max(1, document.documentElement.scrollHeight - innerHeight);
}
function onScroll() {
  pTarget = clamp(window.scrollY / maxScroll(), 0, 1);
  if (window.scrollY > 40) hideIntro();
}

function tick(now) {
  requestAnimationFrame(tick);
  const dt = Math.min(0.05, (now - lastTime) / 1000 || 0.016);
  lastTime = now;
  const time = now / 1000;

  // Frame-rate-independent easing toward the scroll target.
  const k = 1 - Math.exp(-dt * (REDUCE ? 12 : 4.2));
  pSmooth += (pTarget - pSmooth) * k;

  // Interpolated era state for color + active index.
  const ePos = clamp(pSmooth * N - 0.5, 0, N - 1);
  const i0 = Math.floor(ePos), i1 = Math.min(i0 + 1, N - 1);
  const f = smoothstep(ePos - i0);
  const active = clamp(Math.round(ePos), 0, N - 1);

  // Colors morph between the two nearest eras.
  scene.background.copy(COL[i0].bg).lerp(COL[i1].bg, f);
  scene.fog.color.copy(scene.background);
  lineMat.color.copy(COL[i0].accent).lerp(COL[i1].accent, f);
  ptsMat.color.copy(COL[i0].accent2).lerp(COL[i1].accent2, f);

  updateWave(time);

  // Pulse the era markers; the active one breathes brighter.
  for (let i = 0; i < nodeSprites.length; i++) {
    const sp = nodeSprites[i];
    const near = 1 - clamp(Math.abs(i - ePos), 0, 1.6) / 1.6;
    const pulse = 1 + Math.sin(time * 2 + i) * 0.08;
    sp.scale.setScalar(sp.userData.baseScale * (0.7 + near * 0.7) * pulse);
    sp.material.opacity = 0.35 + near * 0.6;
  }

  // Camera glides along the river just behind the focus point.
  const focusU = lerp(U0, U1, pSmooth);
  mouse.x += (mouse.tx - mouse.x) * 0.05;
  mouse.y += (mouse.ty - mouse.y) * 0.05;

  frameAt(clamp(focusU - 0.013, 0, 1), camPos, tmpT, tmpB);
  const sway = REDUCE ? 0 : 1;
  camPos.x += tmpB.x * mouse.x * 6 + Math.sin(time * 0.5) * 1.4 * sway;
  camPos.y += 7.2 + mouse.y * 3 + Math.sin(time * 0.6) * 0.5 * sway;
  camPos.z += tmpB.z * mouse.x * 6;

  curve.getPointAt(clamp(focusU + 0.03, 0, 1), camLook);
  camLook.y += 2.2;
  camera.position.copy(camPos);
  camera.lookAt(camLook);

  if (stars && !REDUCE) {
    stars.rotation.z = Math.sin(time * 0.03) * 0.04;
    stars.position.y = Math.sin(time * 0.1) * 1.5;
  }

  // UI: progress + active-era panel.
  setProgress(pSmooth);
  if (active !== lastActive) {
    lastActive = active;
    showEra(active);
    audio.setEra(active);
  }

  renderer.render(scene, camera);
}

/* ================================================================== *
 *  UI  (overlay DOM)
 * ================================================================== */
function setProgress(p) {
  const bar = $("#progress-fill");
  if (bar) bar.style.transform = `scaleX(${p})`;
  dots.forEach((d, i) => {
    const a = clamp(Math.round(p * N - 0.5), 0, N - 1) === i;
    d.classList.toggle("active", a);
  });
}

let panelBusy = null;
function showEra(i) {
  const era = ERAS[i];
  const panel = $("#panel");
  const lens = LENSES[era.lens];

  const songsHTML = era.songs.filter(s => s.t).map((s) =>
    `<a class="chip" href="${listenURL(s)}" target="_blank" rel="noopener">
       <span class="play">▶</span>${s.t}${s.a ? ` <em>· ${s.a}</em>` : ""}
     </a>`).join("");

  const srcHTML = era.sources.map((s) =>
    `<a href="${s.url}" target="_blank" rel="noopener">${s.label} ↗</a>`).join("");

  const seattleHTML = era.seattle
    ? `<div class="seattle"><span class="pin">📍 Seattle</span>${era.seattle}</div>` : "";

  const html = `
    <div class="p-top">
      <span class="lens lens-${era.lens}">${lens.label}</span>
      <span class="years">${era.years}</span>
    </div>
    <h2 class="p-title">${era.title}</h2>
    <p class="p-genre">${era.genre}</p>
    <p class="p-hook">${era.hook}</p>
    <p class="p-body">${era.body}</p>
    <div class="p-voices">${era.voices.map(v => `<span>${v}</span>`).join("")}</div>
    ${seattleHTML}
    <div class="p-label">Listen</div>
    <div class="p-songs">${songsHTML}</div>
    <div class="p-label">Sources</div>
    <div class="p-sources">${srcHTML}</div>
  `;

  // Cross-fade: out, swap, in.
  panel.classList.add("fading");
  if (panelBusy) clearTimeout(panelBusy);
  panelBusy = setTimeout(() => {
    panel.innerHTML = html;
    panel.scrollTop = 0;
    panel.classList.remove("fading");
  }, REDUCE ? 0 : 220);

  // Tint the panel's accent to match the era.
  $("#overlay").style.setProperty("--accent", era.colors.accent);
  $("#overlay").style.setProperty("--accent2", era.colors.accent2);
  document.documentElement.style.setProperty("--era-accent", era.colors.accent);
}

/* ---- era dots navigation ---- */
let dots = [];
function buildDots() {
  const nav = $("#dots");
  ERAS.forEach((era, i) => {
    const d = document.createElement("button");
    d.className = "dot";
    d.setAttribute("aria-label", `${era.years} — ${era.title}`);
    d.innerHTML = `<span class="dot-label">${era.title}<small>${era.years}</small></span>`;
    d.addEventListener("click", () => scrollToEra(i));
    nav.appendChild(d);
    dots.push(d);
  });
}

function scrollToEra(i) {
  hideIntro();
  const targetP = (i + 0.5) / N;
  const targetY = targetP * maxScroll();
  smoothScrollTo(targetY, REDUCE ? 0 : 1100);
}

function smoothScrollTo(targetY, duration) {
  if (duration <= 0) { window.scrollTo(0, targetY); return; }
  const startY = window.scrollY;
  const dist = targetY - startY;
  const start = performance.now();
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function step(now) {
    const t = clamp((now - start) / duration, 0, 1);
    window.scrollTo(0, startY + dist * ease(t));
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ---- intro overlay ---- */
let introHidden = false;
function hideIntro() {
  if (introHidden) return;
  introHidden = true;
  $("#intro").classList.add("gone");
}

/* ---- about / sources modal ---- */
function buildAbout() {
  const body = $("#about-body");
  const list = ERAS.map((e) => `
    <div class="src-era">
      <h4><span style="color:${e.colors.accent}">●</span> ${e.years} — ${e.title}</h4>
      <ul>${e.sources.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.label} ↗</a></li>`).join("")}</ul>
    </div>`).join("");
  body.innerHTML = `
    <p class="about-lead">An interactive answer to the question:
      <em>“How has Black music evolved throughout history, and how does it reflect
      the issues of its time?”</em></p>
    <p>Made from the standpoint of an 11th-grade <strong>Black Studies Honors</strong>
      student in <strong>Seattle Public Schools</strong>. Each era is read through one of
      the four lenses of the SPS / Washington Ethnic Studies framework — Origins &amp;
      Identity, Power &amp; Oppression, Resistance &amp; Liberation, and Reflection &amp;
      Action — and four “📍 Seattle” threads follow the music home to the Central District:
      the Jackson Street jazz scene, Ray Charles &amp; Quincy Jones, Jimi Hendrix, and
      Sir Mix-a-Lot.</p>
    <p class="about-epi">“${EPIGRAPH.lines.join(" ")}”<br><span>— ${EPIGRAPH.attribution}</span></p>
    <p class="about-method">Built with Three.js. The flowing “river” is a single audio
      waveform whose amplitude, frequency, attack, and harmony are re-shaped for every
      genre — sparse call-and-response swells for the spirituals, syncopated flutter for
      jazz, hard square-wave boom-bap for hip-hop. The optional sound is fully synthesized
      (no copyrighted recordings). Song links open a search so you can hear the originals.</p>
    <h3>All sources, by era</h3>
    <div class="src-grid">${list}</div>
  `;
}

function openAbout() { $("#about").classList.add("open"); }
function closeAbout() { $("#about").classList.remove("open"); }

/* ================================================================== *
 *  FALLBACK (no WebGL) — a fully readable vertical document
 * ================================================================== */
function buildFallback() {
  const root = document.createElement("main");
  root.id = "fallback";
  root.innerHTML = `
    <header class="fb-hero">
      <p class="fb-kicker">An interactive timeline · Black Studies Honors · Seattle Public Schools</p>
      <h1>The River of Sound</h1>
      <p class="fb-sub">How has Black music evolved throughout history, and how does it
        reflect the issues of its time?</p>
      <blockquote>“${EPIGRAPH.lines.join(" ")}”<br><cite>— ${EPIGRAPH.attribution}</cite></blockquote>
      <p class="fb-note">Your browser can’t run the 3D view, so here is the full timeline as text.</p>
    </header>
    ${ERAS.map((e, i) => `
      <section class="fb-era" style="--a:${e.colors.accent};--b:${e.colors.accent2}">
        <div class="fb-num">${String(i + 1).padStart(2, "0")}</div>
        <div class="fb-meta"><span class="lens lens-${e.lens}">${LENSES[e.lens].label}</span>
          <span class="years">${e.years}</span></div>
        <h2>${e.title}</h2>
        <p class="fb-genre">${e.genre}</p>
        <p class="fb-body">${e.body}</p>
        ${e.seattle ? `<p class="fb-seattle"><strong>📍 Seattle —</strong> ${e.seattle}</p>` : ""}
        <p class="fb-voices"><strong>Voices:</strong> ${e.voices.join(" · ")}</p>
        <p class="fb-listen"><strong>Listen:</strong> ${e.songs.filter(s => s.t).map(s =>
          `<a href="${listenURL(s)}" target="_blank" rel="noopener">${s.t}${s.a ? ` (${s.a})` : ""}</a>`).join(" · ")}</p>
        <p class="fb-src"><strong>Sources:</strong> ${e.sources.map(s =>
          `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join(" · ")}</p>
      </section>`).join("")}
    <footer class="fb-foot">Built with Three.js · all music synthesized for the audio bed ·
      research cited above.</footer>
  `;
  document.body.appendChild(root);
}

/* ================================================================== *
 *  BOOT
 * ================================================================== */
function fillIntro() {
  $("#epigraph").innerHTML =
    EPIGRAPH.lines.map(l => `<span>${l}</span>`).join("") +
    `<cite>— ${EPIGRAPH.attribution}</cite>`;
}

function bindControls() {
  audio.onStatus = (s) => { lastStatus = s; updateSoundBtn(); };
  $("#begin").addEventListener("click", () => {
    hideIntro();
    scrollToEra(0);
    if (!REDUCE) audio.enable().then(updateSoundBtn);
  });
  $("#sound-toggle").addEventListener("click", async () => {
    await audio.toggle();
    updateSoundBtn();
  });
  $("#about-toggle").addEventListener("click", openAbout);
  $("#about-close").addEventListener("click", closeAbout);
  $("#about").addEventListener("click", (e) => { if (e.target.id === "about") closeAbout(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeAbout(); });

  addEventListener("pointermove", (e) => {
    mouse.tx = (e.clientX / innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / innerHeight - 0.5) * 2;
  });
}

let lastStatus = "synth"; // whether the current era is playing a real song or the synth band
function updateSoundBtn() {
  const on = audio.isEnabled();
  const btn = $("#sound-toggle");
  if (!btn) return;
  btn.classList.toggle("on", on);
  btn.setAttribute("aria-pressed", String(on));
  btn.querySelector(".s-label").textContent =
    on ? (lastStatus === "song" ? "♪ Song" : "♪ Synth band") : "Sound off";
}

function main() {
  fillIntro();
  buildDots();
  buildAbout();
  bindControls();

  if (!renderer) return; // fallback already rendered

  // Set the scrollable height: roughly one viewport of scroll per era.
  $("#scroll-space").style.height = `${(N + 1.4) * 100}vh`;

  initScene();
  showEra(0);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  requestAnimationFrame(tick);
}

main();
