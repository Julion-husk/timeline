/*
 * AudioEngine — "the band and the river"
 * ------------------------------------------------------------
 * Two layers, one mixer:
 *
 *   1. SONGS  — real tracks you drop into ./audio (e.g. audio/blues.mp3).
 *               The engine auto-detects them per era and crossfades between them.
 *   2. SYNTH  — a fully-synthesized band (kick/snare/hats/bass/pad), with a
 *               per-genre groove, used for any era that has no song file.
 *
 * Transitions "go underwater": every era change briefly dips a shared low-pass
 * filter (a muffle) and crossfades. Rapid era changes (a multi-era jump)
 * automatically shorten into a montage of stabs as you fly by.
 *
 * Everything is gated behind a user gesture and wrapped in try/catch — if Web
 * Audio is missing or a song fails to load, the page is unaffected.
 *
 * To add songs: drop files named <era-id>.mp3 (or .m4a/.ogg/.wav) in ./audio.
 * Era ids: roots, spirituals, blues, jazz, gospel, rocknroll, soul, funk,
 * hiphop, goldenage, neosoul, blm.  (Served over http for the underwater
 * filter to touch the songs; on file:// they still play with a pitch-warp dip.)
 */

import { ERAS } from "./data.js";

const EXTS = ["mp3", "m4a", "ogg", "wav"];
const A2 = 110;
const nf = (semi) => A2 * Math.pow(2, semi / 12); // semitones from A2 -> Hz
const pat = (s) => s.split("").map((c) => c !== "-" && c !== " ");

// Per-genre grooves for the synth band. Drums are 16-step strings ('x' = hit).
// bass is 16 entries (semitone offset from root, or null). chord = pad voicing.
const SYNTH = {
  roots:      { bpm: 96,  swing: .12, root: 0,  bassWave: "triangle", pad: [0, 7, 12],
                kick: "x--x--x-x--x--x-", snare: "----x-------x---", hat: "x-x-x-x-x-x-x-x-",
                bass: [0,null,null,7,null,null,0,null,5,null,null,7,null,null,0,null] },
  spirituals: { bpm: 68,  swing: .0,  root: 0,  bassWave: "sine", pad: [0, 3, 7, 10],
                kick: "x-------x-------", snare: "----x-------x---", hat: "----------------",
                bass: [0,null,null,null,null,null,null,null,7,null,null,null,null,null,null,null] },
  blues:      { bpm: 84,  swing: .33, root: 0,  bassWave: "triangle", pad: [0, 4, 7, 10],
                kick: "x---x---x---x---", snare: "----x-------x---", hat: "x-x-x-x-x-x-x-x-",
                bass: [0,null,7,null,0,null,7,null,5,null,7,null,0,null,null,null] },
  jazz:       { bpm: 124, swing: .34, root: 0,  bassWave: "sine", pad: [0, 4, 7, 11, 14],
                kick: "x-------x-------", snare: "--x---x---x---x-", hat: "x-xxx-xxx-xxx-xx",
                bass: [0,null,4,null,7,null,9,null,7,null,4,null,2,null,0,null] },
  gospel:     { bpm: 100, swing: .14, root: 0,  bassWave: "sine", pad: [0, 4, 7, 12],
                kick: "x---x---x---x---", snare: "----x-------x---", hat: "x-x-x-x-x-x-x-x-",
                bass: [0,null,null,null,5,null,null,null,7,null,null,null,4,null,null,null] },
  rocknroll:  { bpm: 158, swing: .2,  root: 0,  bassWave: "square", pad: [0, 4, 7],
                kick: "x---x---x---x---", snare: "----x-------x---", hat: "xxxxxxxxxxxxxxxx",
                bass: [0,0,7,7,0,0,7,7,5,5,7,7,0,0,7,7] },
  soul:       { bpm: 102, swing: .16, root: 0,  bassWave: "triangle", pad: [0, 4, 9, 11],
                kick: "x-----x-x-----x-", snare: "----x-------x---", hat: "x-x-x-x-x-x-x-x-",
                bass: [0,null,null,4,null,null,7,null,9,null,7,null,4,null,null,null] },
  funk:       { bpm: 108, swing: .08, root: 0,  bassWave: "square", pad: [0, 3, 7, 10, 14],
                kick: "x--x--x---x-x---", snare: "----x-------x---", hat: "x-xxx-xxx-xxx-xx",
                bass: [0,0,null,3,null,0,null,null,7,null,0,null,5,null,3,null] },
  hiphop:     { bpm: 90,  swing: .22, root: 0,  bassWave: "sine", pad: [0, 3, 7, 10],
                kick: "x-----x---x-----", snare: "----x-------x---", hat: "x-x-x-x-x-x-x-x-",
                bass: [0,null,null,null,null,null,3,null,7,null,null,null,5,null,null,null] },
  goldenage:  { bpm: 96,  swing: .18, root: 0,  bassWave: "sawtooth", pad: [0, 3, 7, 8],
                kick: "x---x-x---x-x---", snare: "----x-------x---", hat: "x-xxx-x-x-xxx-x-",
                bass: [0,null,null,3,null,null,7,null,0,null,null,8,null,null,7,null] },
  neosoul:    { bpm: 82,  swing: .3,  root: 0,  bassWave: "triangle", pad: [0, 3, 7, 9, 14],
                kick: "x-----x-----x---", snare: "----x-------x---", hat: "x-x-x-xxx-x-x-xx",
                bass: [0,null,null,null,3,null,null,7,null,9,null,null,5,null,null,null] },
  blm:        { bpm: 76,  swing: .1,  root: 0,  bassWave: "sine", pad: [0, 5, 7, 12],
                kick: "x-------x---x---", snare: "--------x-------", hat: "xxxxxxxxxxxxxxxx",
                bass: [0,null,null,null,null,null,null,null,7,null,null,null,5,null,null,null] },
  // swing-era jazz (Ellington) and Motown soul grooves
  swing:      { bpm: 124, swing: .34, root: 0,  bassWave: "sine", pad: [0, 4, 7, 11, 14],
                kick: "x-------x-------", snare: "--x---x---x---x-", hat: "x-xxx-xxx-xxx-xx",
                bass: [0,null,4,null,7,null,9,null,7,null,4,null,2,null,0,null] },
  motown:     { bpm: 102, swing: .16, root: 0,  bassWave: "triangle", pad: [0, 4, 9, 11],
                kick: "x-----x-x-----x-", snare: "----x-------x---", hat: "x-x-x-x-x-x-x-x-",
                bass: [0,null,null,4,null,null,7,null,9,null,7,null,4,null,null,null] },
};

export class AudioEngine {
  constructor() {
    this.ctx = null; this.ready = false; this.enabled = false;
    this.songs = [];           // { el, ready, gain, node, extIdx }
    this.current = -1;
    this.mode = "synth";
    this._timer = null;
    this._step = 0; this._nextTime = 0;
    this._lastChange = 0;
    this._fileProto = (typeof location !== "undefined" && location.protocol === "file:");
    this.onStatus = null;      // callback(mode) -> "song" | "synth"
  }

  /* ---------------- graph ---------------- */
  _build() {
    if (this.ready) return true;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return false;
      const ctx = new Ctx();
      this.ctx = ctx;

      this.master = ctx.createGain(); this.master.gain.value = 0;
      this.master.connect(ctx.destination);

      // the "underwater" low-pass: open normally, dipped briefly between songs
      this.underwater = ctx.createBiquadFilter();
      this.underwater.type = "lowpass";
      this.underwater.frequency.value = 20000;
      this.underwater.Q.value = 0.7;
      this.underwater.connect(this.master);

      this.musicBus = ctx.createGain(); this.musicBus.gain.value = 1;
      this.musicBus.connect(this.underwater);

      this.synthGain = ctx.createGain(); this.synthGain.gain.value = 0;
      this.synthGain.connect(this.musicBus);

      this.ready = true;
      this._loadSongs();
      return true;
    } catch (e) { this.ready = false; return false; }
  }

  /* ---------------- songs ---------------- */
  _loadSongs() {
    ERAS.forEach((era, i) => {
      const gain = this.ctx.createGain(); gain.gain.value = 0;
      gain.connect(this.musicBus);
      const slot = { el: null, ready: false, gain, node: null, extIdx: 0, era };
      this.songs[i] = slot;
      this._tryLoad(i);
    });
  }

  _tryLoad(i) {
    const slot = this.songs[i];
    if (slot.extIdx >= EXTS.length) { slot.ready = false; return; }
    const el = new Audio();
    el.preload = "auto"; el.loop = true; el.crossOrigin = "anonymous";
    el.src = `audio/${slot.era.id}.${EXTS[slot.extIdx]}`;
    // A song often finishes loading AFTER we've already landed on its era; when
    // it becomes playable, swap it in for the synth right away.
    const onReady = () => {
      if (slot.ready) return;
      slot.ready = true;
      if (this.enabled && this.current === i && this.mode !== "song") this.setEra(i, true);
    };
    el.addEventListener("canplay", onReady);
    el.addEventListener("loadeddata", onReady);
    el.addEventListener("canplaythrough", onReady);
    el.addEventListener("error", () => { if (!slot.ready) { slot.extIdx++; this._tryLoad(i); } }, { once: true });
    slot.el = el;
  }

  _connectSong(slot) {
    if (this._fileProto || slot.node || !slot.el) return; // file:// -> use el.volume
    try { slot.node = this.ctx.createMediaElementSource(slot.el); slot.node.connect(slot.gain); }
    catch (e) { slot.node = null; }
  }

  /* ---------------- public ---------------- */
  isEnabled() { return this.enabled; }

  async enable() {
    if (!this._build()) return false;
    try {
      if (this.ctx.state === "suspended") await this.ctx.resume();
      this.enabled = true;
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.setTargetAtTime(0.85, this.ctx.currentTime, 0.6);
      this._step = 0; this._nextTime = this.ctx.currentTime + 0.06;
      if (!this._timer) this._timer = setInterval(() => this._sched(), 25);
      if (this.current >= 0) this.setEra(this.current, true);
      return true;
    } catch (e) { return false; }
  }

  disable() {
    if (!this.ready) { this.enabled = false; return; }
    try {
      this.enabled = false;
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
      if (this._timer) { clearInterval(this._timer); this._timer = null; }
      this.songs.forEach((s) => { if (s.el) try { s.el.pause(); } catch (e) {} });
    } catch (e) {}
  }

  async toggle() { return this.enabled ? (this.disable(), false) : await this.enable(); }

  // Switch to era `i`. Rapid successive calls auto-shorten into a flyby montage.
  setEra(i, force = false) {
    const prev = this.current;
    this.current = i;
    if (!this.ready || !this.enabled) return;
    const now = this.ctx.currentTime;
    const dt = now - this._lastChange;
    const fast = !force && dt < 0.5;            // a quick pass-through
    this._lastChange = now;
    const xfade = fast ? 0.16 : 1.1;

    try {
      this._dive(fast ? 0.5 : 1.1);             // underwater low-pass dip

      const slot = this.songs[i];
      const hasSong = slot && (slot.ready || (slot.el && slot.el.readyState >= 2));

      if (hasSong) {
        this.mode = "song";
        this._connectSong(slot);
        const el = slot.el;
        if (fast || el.paused) { try { el.currentTime = slot.era.audioStart || 0; } catch (e) {} }
        const p = el.play(); if (p && p.catch) p.catch(() => {});
        if (this._fileProto || !slot.node) {    // crossfade via element volume
          el.volume = 0.0; this._fadeEl(el, 1.0, xfade);
          if (fast) this._warp(el);
        } else {
          slot.gain.gain.cancelScheduledValues(now);
          slot.gain.gain.setTargetAtTime(1.0, now, xfade * 0.5);
        }
        this.synthGain.gain.cancelScheduledValues(now);
        this.synthGain.gain.setTargetAtTime(0.0, now, xfade * 0.5);
      } else {
        this.mode = "synth";
        this.synthGain.gain.cancelScheduledValues(now);
        this.synthGain.gain.setTargetAtTime(0.9, now, xfade * 0.5);
      }

      // fade out / pause the previous song
      if (prev >= 0 && prev !== i && this.songs[prev]) {
        const ps = this.songs[prev];
        if ((this._fileProto || !ps.node) && ps.el) { this._fadeEl(ps.el, 0.0, xfade, true); }
        else if (ps.node) {
          ps.gain.gain.cancelScheduledValues(now); ps.gain.gain.setTargetAtTime(0.0, now, xfade * 0.4);
          if (ps.el) { try { setTimeout(() => { if (this.current !== prev) ps.el.pause(); }, (xfade + 0.2) * 1000); } catch (e) {} }
        }
      }

      if (this.onStatus) { try { this.onStatus(hasSong ? "song" : "synth"); } catch (e) {} }
    } catch (e) {}
  }

  /* ---------------- transitions ---------------- */
  // The "underwater" transition between songs: dip the low-pass filter down,
  // then let it open back up. That muffle is the whole effect — nothing else.
  _dive(amount) {
    try {
      const now = this.ctx.currentTime, f = this.underwater.frequency;
      const low = 240, hi = 20000, depth = 0.5 * amount;
      f.cancelScheduledValues(now);
      f.setValueAtTime(Math.max(low, f.value), now);
      f.exponentialRampToValueAtTime(low, now + depth * 0.45);
      f.exponentialRampToValueAtTime(hi, now + depth + 0.7);
    } catch (e) {}
  }

  _fadeEl(el, to, dur, pauseAfter) {
    const steps = 12, from = el.volume, dt = (dur * 1000) / steps;
    let k = 0;
    const id = setInterval(() => {
      k++;
      try { el.volume = Math.max(0, Math.min(1, from + (to - from) * (k / steps))); } catch (e) {}
      if (k >= steps) { clearInterval(id); if (pauseAfter) try { el.pause(); } catch (e) {} }
    }, dt);
  }

  _warp(el) { // pitch-dip a file:// song so the transition still feels submerged
    try {
      el.playbackRate = 0.82;
      setTimeout(() => { try { el.playbackRate = 1.0; } catch (e) {} }, 360);
    } catch (e) {}
  }

  /* ---------------- synth scheduler ---------------- */
  _sched() {
    if (!this.enabled || !this.ready) return;
    try {
      const ctx = this.ctx, ahead = 0.12;
      const s = SYNTH[ERAS[this.current] ? ERAS[this.current].id : "roots"] || SYNTH.roots;
      const stepDur = (60 / s.bpm) / 4;
      while (this._nextTime < ctx.currentTime + ahead) {
        const step = this._step % 16;
        const swing = (step % 2 === 1) ? s.swing * stepDur : 0;
        const t = this._nextTime + swing;
        if (this.mode === "synth") this._playStep(s, step, t, stepDur);
        this._nextTime += stepDur;
        this._step++;
      }
    } catch (e) { /* keep the page alive; just stop scheduling on error */
      if (this._timer) { clearInterval(this._timer); this._timer = null; }
    }
  }

  _playStep(s, step, t, stepDur) {
    const kick = pat(s.kick), snare = pat(s.snare), hat = pat(s.hat);
    if (kick[step]) this._kick(t);
    if (snare[step]) this._snare(t);
    if (hat[step]) this._hat(t);
    const b = s.bass[step];
    if (b !== null && b !== undefined) this._bass(t, nf(s.root + b - 24), stepDur * 1.8, s.bassWave);
    if (step === 0 && s.pad) this._pad(t, s.pad.map((o) => nf(s.root + o - 12)), stepDur * 14);
  }

  _env(g, t, a, peak, d) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }
  _kick(t) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.12);
    this._env(g, t, 0.005, 0.9, 0.18); o.connect(g); g.connect(this.synthGain);
    o.start(t); o.stop(t + 0.25);
  }
  _snare(t) {
    const ctx = this.ctx, len = (ctx.sampleRate * 0.2) | 0, buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const bp = ctx.createBiquadFilter(); bp.type = "highpass"; bp.frequency.value = 1400;
    const g = ctx.createGain(); this._env(g, t, 0.004, 0.5, 0.16);
    src.connect(bp); bp.connect(g); g.connect(this.synthGain);
    src.start(t); src.stop(t + 0.2);
  }
  _hat(t) {
    const ctx = this.ctx, len = (ctx.sampleRate * 0.05) | 0, buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 7000;
    const g = ctx.createGain(); this._env(g, t, 0.002, 0.18, 0.04);
    src.connect(hp); hp.connect(g); g.connect(this.synthGain);
    src.start(t); src.stop(t + 0.06);
  }
  _bass(t, freq, dur, wave) {
    const o = this.ctx.createOscillator(), lp = this.ctx.createBiquadFilter(), g = this.ctx.createGain();
    o.type = wave || "triangle"; o.frequency.setValueAtTime(freq, t);
    lp.type = "lowpass"; lp.frequency.value = 600;
    this._env(g, t, 0.01, 0.45, dur); o.connect(lp); lp.connect(g); g.connect(this.synthGain);
    o.start(t); o.stop(t + dur + 0.1);
  }
  _pad(t, freqs, dur) {
    const g = this.ctx.createGain(), lp = this.ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 1600;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.14, t + dur * 0.25);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    lp.connect(g); g.connect(this.synthGain);
    freqs.forEach((f, k) => {
      const o = this.ctx.createOscillator();
      o.type = "sawtooth"; o.frequency.value = f; o.detune.value = (k - freqs.length / 2) * 4;
      o.connect(lp); o.start(t); o.stop(t + dur + 0.1);
    });
  }
}
