/**
 * Procedural Web Audio SFX engine — ported/adapted from the layered synthesis
 * used on anoma.ly/notes/opencode-reloaded. Zero audio files: every sound is
 * oscillators + filtered noise + an optional delay "shimmer" send.
 */

type ToneLayer = {
  kind: "tone";
  waveform: OscillatorType;
  frequency: number;
  glideTo?: number;
  glideTime?: number;
  detune?: number;
  offset?: number; // start delay in seconds
  attack: number;
  decay: number;
  peak: number;
  envelope?: "smooth";
};

type NoiseLayer = {
  kind: "noise";
  filterType: BiquadFilterType;
  filterFrequency: number;
  filterTo?: number;
  filterTime?: number;
  filterQ?: number;
  offset?: number;
  attack: number;
  decay: number;
  peak: number;
  envelope?: "smooth";
};

type Layer = ToneLayer | NoiseLayer;

type Shimmer = {
  delay: number;
  feedback: number;
  wet: number;
  lowpass: number;
};

type SoundDef = {
  masterGain: number;
  layers: Layer[];
  shimmer?: Shimmer;
};

function smoothCurve(attack: number, decay: number, peak: number): Float32Array {
  const total = attack + decay;
  const n = 257;
  return Float32Array.from({ length: n }, (_, i) => {
    const t = (total * i) / (n - 1);
    const c = t <= attack ? t / attack : 1 - (t - attack) / decay;
    return peak * (0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, c))));
  });
}

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;
let unlocked = false;
const unlockWaiters: Array<() => void> = [];

function getCtx(): AudioContext | null {
  if (ctx) return ctx;
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 1;
    master.connect(ctx.destination);
  } catch {
    return null;
  }
  return ctx;
}

function getNoiseBuffer(c: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer;
  const len = Math.floor(c.sampleRate * 0.5);
  noiseBuffer = c.createBuffer(1, len, c.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return noiseBuffer;
}

function scheduleLayer(c: AudioContext, dest: AudioNode, layer: Layer, when: number) {
  const start = when + (layer.offset ?? 0);
  const envTotal = layer.attack + layer.decay;

  if (layer.kind === "tone") {
    const osc = c.createOscillator();
    osc.type = layer.waveform;
    osc.frequency.setValueAtTime(layer.frequency, start);
    if (layer.detune) osc.detune.value = layer.detune;
    if (layer.glideTo !== undefined) {
      const gt = layer.glideTime ?? envTotal;
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(1, layer.glideTo),
        start + gt,
      );
    }

    const gain = c.createGain();
    if (layer.envelope === "smooth") {
      gain.gain.setValueCurveAtTime(
        smoothCurve(layer.attack, layer.decay, layer.peak),
        start,
        envTotal,
      );
    } else {
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(
        Math.max(0.0001, layer.peak),
        start + layer.attack,
      );
      gain.gain.exponentialRampToValueAtTime(0.0001, start + envTotal);
    }

    osc.connect(gain).connect(dest);
    osc.start(start);
    osc.stop(start + envTotal + 0.05);
    return;
  }

  // noise layer
  const src = c.createBufferSource();
  src.buffer = getNoiseBuffer(c);
  src.loop = true;

  const filter = c.createBiquadFilter();
  filter.type = layer.filterType;
  filter.frequency.setValueAtTime(layer.filterFrequency, start);
  filter.Q.value = layer.filterQ ?? 1;
  if (layer.filterTo !== undefined) {
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(20, layer.filterTo),
      start + (layer.filterTime ?? envTotal),
    );
  }

  const gain = c.createGain();
  if (layer.envelope === "smooth") {
    gain.gain.setValueCurveAtTime(
      smoothCurve(layer.attack, layer.decay, layer.peak),
      start,
      envTotal,
    );
  } else {
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(
      Math.max(0.0001, layer.peak),
      start + layer.attack,
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, start + envTotal);
  }

  src.connect(filter).connect(gain).connect(dest);
  src.start(start);
  src.stop(start + envTotal + 0.05);
}

function scheduleShimmer(
  c: AudioContext,
  voiceOut: AudioNode,
  shimmer: Shimmer,
) {
  const input = c.createGain();
  const delay = c.createDelay(1.0);
  delay.delayTime.value = shimmer.delay;
  const fb = c.createGain();
  fb.gain.value = shimmer.feedback;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = shimmer.lowpass;
  const wet = c.createGain();
  wet.gain.value = shimmer.wet;

  voiceOut.connect(input);
  input.connect(delay);
  delay.connect(lp);
  lp.connect(fb);
  fb.connect(delay);
  lp.connect(wet);
  wet.connect(master!);
}

/** ── Sound bank ─────────────────────────────────────────────────────────── */

const BANK: Record<string, SoundDef> = {
  chime: {
    masterGain: 0.5,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 1046.5, attack: 0.006, decay: 0.22, peak: 0.09 },
      { kind: "tone", waveform: "sine", frequency: 1568, offset: 0.09, attack: 0.006, decay: 0.26, peak: 0.08 },
    ],
    shimmer: { delay: 0.12, feedback: 0.25, wet: 0.18, lowpass: 4000 },
  },
  sparkle: {
    masterGain: 0.45,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 1760, attack: 0.003, decay: 0.09, peak: 0.045 },
      { kind: "tone", waveform: "sine", frequency: 2217, offset: 0.045, attack: 0.003, decay: 0.09, peak: 0.04 },
      { kind: "tone", waveform: "sine", frequency: 2637, offset: 0.09, attack: 0.003, decay: 0.1, peak: 0.038 },
      { kind: "tone", waveform: "sine", frequency: 3520, offset: 0.135, attack: 0.003, decay: 0.12, peak: 0.032 },
    ],
    shimmer: { delay: 0.07, feedback: 0.35, wet: 0.2, lowpass: 6000 },
  },
  droplet: {
    masterGain: 0.55,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 1200, glideTo: 550, glideTime: 0.14, attack: 0.004, decay: 0.2, peak: 0.075 },
    ],
    shimmer: { delay: 0.09, feedback: 0.2, wet: 0.15, lowpass: 3000 },
  },
  tick: {
    masterGain: 0.4,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 5400, filterQ: 1.8, attack: 0.001, decay: 0.018, peak: 0.14 },
      { kind: "tone", waveform: "sine", frequency: 2600, attack: 0.001, decay: 0.012, peak: 0.018 },
    ],
  },
  press: {
    masterGain: 0.4,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 1700, filterQ: 1.4, attack: 0.001, decay: 0.02, peak: 0.13 },
    ],
  },
  release: {
    masterGain: 0.4,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 4600, filterQ: 1.8, attack: 0.001, decay: 0.016, peak: 0.12 },
      { kind: "tone", waveform: "sine", frequency: 3200, offset: 0.006, attack: 0.001, decay: 0.05, peak: 0.02 },
    ],
  },
  toggle: {
    masterGain: 0.4,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 2200, filterQ: 1.6, attack: 0.001, decay: 0.016, peak: 0.12 },
      { kind: "noise", filterType: "bandpass", filterFrequency: 3800, filterQ: 1.6, offset: 0.024, attack: 0.001, decay: 0.02, peak: 0.1 },
    ],
  },
  success: {
    masterGain: 0.5,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 880, attack: 0.004, decay: 0.09, peak: 0.06 },
      { kind: "tone", waveform: "sine", frequency: 1108.73, offset: 0.06, attack: 0.004, decay: 0.1, peak: 0.06 },
      { kind: "tone", waveform: "sine", frequency: 1318.51, offset: 0.12, attack: 0.004, decay: 0.18, peak: 0.07 },
    ],
    shimmer: { delay: 0.1, feedback: 0.22, wet: 0.16, lowpass: 4500 },
  },
  error: {
    masterGain: 0.42,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 850, filterQ: 1.1, attack: 0.001, decay: 0.035, peak: 0.13 },
      { kind: "tone", waveform: "triangle", frequency: 440, offset: 0.025, attack: 0.004, decay: 0.09, peak: 0.045 },
      { kind: "tone", waveform: "triangle", frequency: 349.23, offset: 0.1, attack: 0.004, decay: 0.14, peak: 0.04 },
    ],
  },
  page: {
    masterGain: 0.38,
    layers: [
      { kind: "noise", filterType: "lowpass", filterFrequency: 1800, filterQ: 0.7, attack: 0.006, decay: 0.08, peak: 0.11 },
      { kind: "noise", filterType: "bandpass", filterFrequency: 4200, filterQ: 1.2, offset: 0.04, attack: 0.004, decay: 0.065, peak: 0.08 },
      { kind: "tone", waveform: "sine", frequency: 2400, offset: 0.075, attack: 0.002, decay: 0.045, peak: 0.02 },
    ],
  },
  erase: {
    masterGain: 0.42,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 2600, filterQ: 0.9, attack: 0.001, decay: 0.05, peak: 0.09 },
      { kind: "tone", waveform: "triangle", frequency: 640, glideTo: 170, glideTime: 0.1, attack: 0.002, decay: 0.11, peak: 0.05 },
      { kind: "noise", filterType: "highpass", filterFrequency: 5200, filterQ: 0.8, offset: 0.055, attack: 0.001, decay: 0.014, peak: 0.06 },
      { kind: "noise", filterType: "highpass", filterFrequency: 5200, filterQ: 0.8, offset: 0.092, attack: 0.001, decay: 0.01, peak: 0.04 },
    ],
  },
  rewind: {
    masterGain: 0.32,
    layers: [
      {
        kind: "noise",
        filterType: "lowpass",
        filterFrequency: 650,
        filterTo: 1800,
        filterTime: 0.65,
        filterQ: 0.6,
        envelope: "smooth",
        attack: 0.62,
        decay: 0.63,
        peak: 0.028,
      },
    ],
  },
  scan: {
    masterGain: 0.4,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 740, attack: 0.002, decay: 0.055, peak: 0.05 },
      { kind: "tone", waveform: "sine", frequency: 1110, offset: 0.045, attack: 0.002, decay: 0.055, peak: 0.045 },
      { kind: "tone", waveform: "sine", frequency: 1665, offset: 0.09, attack: 0.002, decay: 0.07, peak: 0.035 },
    ],
    shimmer: { delay: 0.065, feedback: 0.16, wet: 0.1, lowpass: 4200 },
  },
  ready: {
    masterGain: 0.48,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 3600, filterQ: 1.8, attack: 0.001, decay: 0.02, peak: 0.11 },
      { kind: "tone", waveform: "triangle", frequency: 330, glideTo: 660, glideTime: 0.12, offset: 0.012, attack: 0.004, decay: 0.16, peak: 0.055 },
      { kind: "tone", waveform: "sine", frequency: 990, offset: 0.13, attack: 0.004, decay: 0.22, peak: 0.06 },
    ],
    shimmer: { delay: 0.1, feedback: 0.16, wet: 0.1, lowpass: 4200 },
  },
  whisper: {
    masterGain: 0.48,
    layers: [
      { kind: "noise", filterType: "lowpass", filterFrequency: 1600, filterQ: 0.7, attack: 0.025, decay: 0.13, peak: 0.04 },
      { kind: "tone", waveform: "sine", frequency: 880, glideTo: 660, glideTime: 0.14, offset: 0.01, attack: 0.012, decay: 0.14, peak: 0.025 },
    ],
  },
  glitch: {
    masterGain: 0.4,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 3200, filterQ: 3, attack: 0.001, decay: 0.012, peak: 0.12 },
      { kind: "noise", filterType: "bandpass", filterFrequency: 5800, filterQ: 2.4, offset: 0.018, attack: 0.001, decay: 0.01, peak: 0.1 },
      { kind: "tone", waveform: "square", frequency: 1800, glideTo: 420, glideTime: 0.05, offset: 0.008, attack: 0.001, decay: 0.05, peak: 0.02 },
    ],
  },
  arrival: {
    masterGain: 0.44,
    layers: [
      { kind: "noise", filterType: "lowpass", filterFrequency: 900, filterQ: 0.8, attack: 0.05, decay: 0.24, peak: 0.035 },
      { kind: "tone", waveform: "sine", frequency: 220, glideTo: 440, glideTime: 0.32, attack: 0.04, decay: 0.34, peak: 0.055 },
      { kind: "tone", waveform: "sine", frequency: 659.25, offset: 0.12, attack: 0.045, decay: 0.32, peak: 0.04 },
      { kind: "tone", waveform: "sine", frequency: 987.77, offset: 0.19, attack: 0.045, decay: 0.34, peak: 0.032 },
    ],
    shimmer: { delay: 0.16, feedback: 0.28, wet: 0.18, lowpass: 3200 },
  },
  bell: {
    masterGain: 0.42,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 1760, attack: 0.002, decay: 0.55, peak: 0.05 },
      { kind: "tone", waveform: "sine", frequency: 1760 * 2.76, attack: 0.001, decay: 0.28, peak: 0.018 },
      { kind: "tone", waveform: "sine", frequency: 9504, attack: 0.001, decay: 0.09, peak: 0.008 },
      { kind: "noise", filterType: "bandpass", filterFrequency: 5200, filterQ: 2.4, attack: 0.001, decay: 0.012, peak: 0.05 },
    ],
    shimmer: { delay: 0.09, feedback: 0.12, wet: 0.08, lowpass: 6000 },
  },
};

export type SoundName = keyof typeof BANK & string;

/** UI-intent cue map → (sound, volume), like the source site's `hp` table. */
export const CUES: Record<string, { sound: SoundName; volume: number }> = {
  select: { sound: "release", volume: 1.6 },
  adjust: { sound: "toggle", volume: 1.1 },
  dial: { sound: "tick", volume: 0.9 },
  typing: { sound: "press", volume: 1.3 },
  delete: { sound: "erase", volume: 0.5 },
  glitch: { sound: "glitch", volume: 0.8 },
  collapse: { sound: "whisper", volume: 0.8 },
  add: { sound: "page", volume: 0.7 },
  reply: { sound: "tick", volume: 1.1 },
  start: { sound: "press", volume: 1.6 },
  scan: { sound: "scan", volume: 0.6 },
  complete: { sound: "success", volume: 0.7 },
  loading: { sound: "rewind", volume: 0.5 },
  rewind: { sound: "rewind", volume: 0.9 },
  appear: { sound: "tick", volume: 1.1 },
  ready: { sound: "ready", volume: 0.6 },
  bell: { sound: "bell", volume: 0.5 },
  success: { sound: "success", volume: 0.5 },
  flick: { sound: "release", volume: 1.0 },
  glare: { sound: "whisper", volume: 0.7 },
  chime: { sound: "chime", volume: 0.55 },
  arrival: { sound: "arrival", volume: 0.6 },
};

export function hasSound(name: string): name is SoundName {
  return Object.prototype.hasOwnProperty.call(BANK, name);
}

function rawPlay(name: SoundName, volume: number) {
  const c = getCtx();
  if (!c || !master) return;
  const def = BANK[name];
  if (!def) return;
  if (typeof document !== "undefined" && document.hidden) return;

  const now = c.currentTime;
  const gain = c.createGain();
  gain.gain.value = Math.max(0, Math.min(2, volume)) * def.masterGain;
  gain.connect(master);

  for (const layer of def.layers) scheduleLayer(c, gain, layer, now);
  if (def.shimmer) scheduleShimmer(c, gain, def.shimmer);

  // GC the voice node after the sound could have finished
  const maxLen =
    Math.max(
      ...def.layers.map(
        (l) =>
          (l.offset ?? 0) +
          l.attack +
          l.decay +
          (l.kind === "tone" ? (l.glideTime ?? 0) : 0),
      ),
    ) + (def.shimmer ? def.shimmer.delay * 4 : 0) + 0.2;
  window.setTimeout(() => {
    try {
      gain.disconnect();
    } catch {
      /* already gone */
    }
  }, maxLen * 1000);
}

/** Play a bank sound directly. Honors unlock state; caller gates on mute. */
export function playSound(name: SoundName, opts?: { volume?: number }) {
  const c = getCtx();
  if (!c) return;
  if (c.state !== "running") return; // wait for user-activation unlock
  const vol = opts?.volume ?? 1;
  if (vol === 0) return;
  rawPlay(name, vol);
}

/** Play a named cue (maps through CUES). */
export function playCue(cue: string, opts?: { volume?: number }) {
  const mapped = CUES[cue];
  if (!mapped) return;
  playSound(mapped.sound, { volume: (opts?.volume ?? 1) * mapped.volume });
}

function tryUnlock() {
  const c = getCtx();
  if (!c) return;
  if (c.state === "running") {
    if (!unlocked) {
      unlocked = true;
      while (unlockWaiters.length) unlockWaiters.shift()!();
    }
    return;
  }
  if (
    typeof navigator !== "undefined" &&
    navigator.userActivation &&
    !navigator.userActivation.hasBeenActive
  ) {
    return;
  }
  c.resume()
    .then(() => {
      unlocked = true;
      while (unlockWaiters.length) unlockWaiters.shift()!();
    })
    .catch(() => {
      /* will retry on next gesture */
    });
}

let listenersAttached = false;

/** Attach one-time gesture listeners that unlock the AudioContext. */
export function attachUnlockListeners() {
  if (listenersAttached || typeof window === "undefined") return;
  listenersAttached = true;
  const handler = () => tryUnlock();
  window.addEventListener("pointerdown", handler, { capture: true, passive: true });
  window.addEventListener("keydown", handler, true);
  window.addEventListener("click", handler, { capture: true, passive: true });
  tryUnlock();
}

/** Resolve once the context is running (or immediately if it already is). */
export function whenUnlocked(fn: () => void) {
  const c = getCtx();
  if (c && c.state === "running") {
    fn();
    return;
  }
  unlockWaiters.push(fn);
  attachUnlockListeners();
  tryUnlock();
}
