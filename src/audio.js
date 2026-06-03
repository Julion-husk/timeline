/*
 * AudioEngine — a tiny, fully-synthesized ambient bed.
 *
 * It plays NO copyrighted music. It generates an evolving drone (a chord pad)
 * plus a soft heartbeat pulse whose harmony and tempo shift to match each era,
 * so the river you see is also a river you (optionally) hear. Everything is
 * wrapped in try/catch and gated behind a user gesture; if Web Audio is
 * unavailable the page is completely unaffected.
 */

// Per-era musical character: a small chord (semitone offsets from a root),
// a root pitch, a filter brightness, and a pulse tempo (beats/sec).
const ROOT = 110; // A2
const semi = (n) => ROOT * Math.pow(2, n / 12);

const PROFILES = {
  roots:      { chord: [0, 7, 12, 19],      cutoff: 700,  bpm: 1.4, wave: "sine" },
  spirituals: { chord: [0, 3, 7, 10],       cutoff: 600,  bpm: 1.1, wave: "sine" },   // minor, prayerful
  blues:      { chord: [0, 3, 6, 10],       cutoff: 750,  bpm: 1.5, wave: "triangle" },// flat-five blues color
  jazz:       { chord: [0, 4, 7, 11, 14],   cutoff: 1100, bpm: 2.0, wave: "triangle" },// maj7/9 shimmer
  gospel:     { chord: [0, 4, 7, 12],       cutoff: 950,  bpm: 1.3, wave: "sine" },    // bright major
  rocknroll:  { chord: [0, 4, 7, 10],       cutoff: 1200, bpm: 2.2, wave: "sawtooth" },// dominant 7
  soul:       { chord: [0, 4, 9, 11],       cutoff: 900,  bpm: 1.6, wave: "triangle" },// warm maj
  funk:       { chord: [0, 3, 7, 10, 14],   cutoff: 1300, bpm: 2.3, wave: "sawtooth" },// min9 groove
  hiphop:     { chord: [0, 3, 7, 10],       cutoff: 800,  bpm: 1.8, wave: "square" },   // dark min
  goldenage:  { chord: [0, 3, 7, 8],        cutoff: 1000, bpm: 2.1, wave: "sawtooth" }, // tense b6
  neosoul:    { chord: [0, 3, 7, 9, 14],    cutoff: 950,  bpm: 1.5, wave: "triangle" }, // min6/9 mellow
  blm:        { chord: [0, 5, 7, 12],       cutoff: 1100, bpm: 2.0, wave: "triangle" }, // sus4 → unresolved
};

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.ready = false;
    this.enabled = false;
    this.voices = [];
    this.master = null;
    this.filter = null;
    this.pulseGain = null;
    this._pulseTimer = null;
    this._currentEra = null;
  }

  _build() {
    if (this.ready) return true;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return false;
      const ctx = new Ctx();
      this.ctx = ctx;

      const master = ctx.createGain();
      master.gain.value = 0.0; // fade in on enable
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 800;
      filter.Q.value = 0.6;
      filter.connect(master);
      master.connect(ctx.destination);

      // Five reusable drone voices (osc -> per-voice gain -> filter).
      this.voices = [];
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = ROOT;
        osc.detune.value = (i - 2) * 4; // gentle chorus
        g.gain.value = 0.0;
        osc.connect(g);
        g.connect(filter);
        osc.start();
        this.voices.push({ osc, g });
      }

      this.master = master;
      this.filter = filter;
      this.ready = true;
      return true;
    } catch (e) {
      this.ready = false;
      return false;
    }
  }

  isEnabled() { return this.enabled; }

  async enable() {
    if (!this._build()) return false;
    try {
      if (this.ctx.state === "suspended") await this.ctx.resume();
      this.enabled = true;
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setTargetAtTime(0.16, now, 1.2);
      if (this._currentEra) this.setEra(this._currentEra, true);
      this._scheduleNextPulse();
      return true;
    } catch (e) {
      return false;
    }
  }

  disable() {
    if (!this.ready) { this.enabled = false; return; }
    try {
      this.enabled = false;
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setTargetAtTime(0.0, now, 0.4);
      if (this._pulseTimer) { clearTimeout(this._pulseTimer); this._pulseTimer = null; }
    } catch (e) { /* ignore */ }
  }

  async toggle() {
    if (this.enabled) { this.disable(); return false; }
    return await this.enable();
  }

  // Smoothly move the pad to a new era's harmony / brightness / tempo.
  setEra(era, force = false) {
    this._currentEra = era;
    if (!this.ready || !this.enabled) return;
    const p = PROFILES[era.id] || PROFILES.roots;
    try {
      const now = this.ctx.currentTime;
      const chord = p.chord;
      this.voices.forEach((v, i) => {
        const interval = chord[i % chord.length] + (i >= chord.length ? 12 : 0);
        const freq = semi(interval - 12); // drop an octave for warmth
        v.osc.type = p.wave;
        v.osc.frequency.setTargetAtTime(freq, now, 0.6);
        const active = i < chord.length ? 0.18 : 0.0;
        v.g.gain.setTargetAtTime(active, now, 0.8);
      });
      this.filter.frequency.setTargetAtTime(p.cutoff, now, 1.0);
      this._bpm = p.bpm;
    } catch (e) { /* ignore */ }
  }

  // A soft "heartbeat" — schedules itself on a loop matching era tempo.
  _scheduleNextPulse() {
    if (!this.enabled || !this.ready) return;
    const bpm = this._bpm || 1.6;
    const interval = 1000 / bpm;
    this._pulseTimer = setTimeout(() => {
      this._pulse();
      this._scheduleNextPulse();
    }, interval);
  }

  _pulse() {
    if (!this.enabled || !this.ready) return;
    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(48, now + 0.18);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.09, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
      osc.connect(g);
      g.connect(this.master);
      osc.start(now);
      osc.stop(now + 0.36);
    } catch (e) { /* ignore */ }
  }
}
