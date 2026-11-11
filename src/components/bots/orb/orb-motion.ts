import gsap from "gsap";
import { ORB_PRESETS, ORB_SURGE_INTERVAL, type OrbParams, type OrbState } from "./orb-states";

/** Tudo que o renderizador precisa para desenhar um quadro. */
export type OrbFrame = OrbParams & {
  /** tempo corrido (s) */
  t: number;
  /** fases acumuladas: mudam de velocidade sem dar salto */
  flowPhase: number;
  spinPhase: number;
  orbitPhase: number;
  ripplePhase: number;
  ringPhase: number;
  /** cursor suavizado, de -1 a 1 (x para a direita, y para baixo) */
  pointerX: number;
  pointerY: number;
  /** nível de áudio suavizado, 0–1 */
  audio: number;
  /** surto espontâneo de energia, 0–1 */
  surge: number;
  /** entrada/saída, 0–1 */
  reveal: number;
  /** escala final da esfera */
  scale: number;
};

// Parâmetros de "energia" respondem rápido; os de movimento chegam depois.
// Essa defasagem é o que faz a troca de estado parecer orgânica.
const ENERGY_KEYS = ["intensity", "core", "filGlow", "partGlow", "shell", "bloom", "violet", "audioScale", "audioGlow", "ripple", "ring"] as const;
const MOTION_KEYS = ["displace", "dispFreq", "flow", "breathAmp", "breathRate", "filSpeed", "filArc", "partSpeed", "partTight", "turbulence", "ringSpeed"] as const;

function pick(preset: OrbParams, keys: readonly (keyof OrbParams)[]) {
  const out: Partial<OrbParams> = {};
  for (const key of keys) out[key] = preset[key];
  return out;
}

/** Controla a animação da Orb: o GSAP interpola os parâmetros entre estados,
 *  dispara surtos espontâneos e cuida da entrada/saída; `tick` integra as
 *  fases e suaviza o áudio a cada quadro. Não conhece Three.js. */
export class OrbMotion {
  private readonly params: OrbParams;
  private readonly live = { surge: 0, reveal: 0 };
  private readonly frame: OrbFrame;
  private state: OrbState;
  private active: boolean | null = null;
  private surgeCall: gsap.core.Tween | null = null;
  private breathPhase = 0;
  private speechPhase = Math.random() * 100;

  constructor(
    private readonly reducedMotion: boolean,
    initialState: OrbState = "idle",
  ) {
    this.state = initialState;
    this.params = { ...ORB_PRESETS[initialState] };
    this.frame = {
      ...this.params,
      t: 0,
      flowPhase: Math.random() * 50,
      spinPhase: Math.random() * 50,
      orbitPhase: Math.random() * 50,
      ripplePhase: 0,
      ringPhase: 0,
      pointerX: 0,
      pointerY: 0,
      audio: 0,
      surge: 0,
      reveal: 0,
      scale: 0,
    };
    if (!reducedMotion) this.scheduleSurge();
  }

  setState(state: OrbState) {
    if (state === this.state) return;
    this.state = state;
    const preset = ORB_PRESETS[state];
    gsap.to(this.params, { ...pick(preset, ENERGY_KEYS), duration: 0.9, ease: "power2.out", overwrite: "auto" });
    gsap.to(this.params, { ...pick(preset, MOTION_KEYS), duration: 2.1, ease: "sine.inOut", overwrite: "auto" });
    if (!this.reducedMotion) {
      // um pulso marca a troca e o ritmo de surtos passa a ser o do novo estado
      this.fireSurge(0.6);
      this.scheduleSurge();
    }
  }

  setActive(active: boolean) {
    if (active === this.active) return;
    this.active = active;
    gsap.to(this.live, {
      reveal: active ? 1 : 0,
      duration: active ? 2.2 : 0.9,
      ease: active ? "expo.out" : "power2.in",
      overwrite: "auto",
    });
  }

  private scheduleSurge() {
    this.surgeCall?.kill();
    const [min, max] = ORB_SURGE_INTERVAL[this.state];
    this.surgeCall = gsap.delayedCall(gsap.utils.random(min, max), () => {
      this.fireSurge(gsap.utils.random(0.45, 1));
      this.scheduleSurge();
    });
  }

  private fireSurge(peak: number) {
    gsap.killTweensOf(this.live, "surge");
    gsap
      .timeline()
      .to(this.live, { surge: peak, duration: 0.22, ease: "power2.out" })
      .to(this.live, { surge: 0, duration: gsap.utils.random(1.1, 1.9), ease: "power2.inOut" });
  }

  /** Envelope parecido com fala, usado enquanto não chega áudio de verdade. */
  private simulatedAudio(dt: number) {
    if (this.state !== "listening" && this.state !== "speaking") return 0;
    this.speechPhase += dt;
    const s = this.speechPhase;
    const syllables = 0.5 + 0.5 * Math.sin(s * 9.3 + Math.sin(s * 2.1) * 2);
    const phrase = Math.max(0, Math.sin(s * 1.3) * 0.6 + Math.sin(s * 0.47 + 1.7) * 0.5 + 0.35);
    const level = Math.min(1, syllables * phrase);
    return this.state === "speaking" ? level : level * 0.6;
  }

  /** Avança um quadro. `audioLevel` indefinido = sem fonte de áudio. */
  tick(delta: number, audioLevel: number | undefined, pointerX = 0, pointerY = 0): OrbFrame {
    const dt = Math.min(delta, 0.05) * (this.reducedMotion ? 0.3 : 1);
    const p = this.params;
    const f = this.frame;
    Object.assign(f, p);

    const target = audioLevel === undefined ? this.simulatedAudio(dt) : Math.min(1, Math.max(0, audioLevel));
    // ataque rápido, soltura lenta: acompanha a voz sem tremer
    const rate = target > f.audio ? 18 : 5;
    f.audio += (target - f.audio) * (1 - Math.exp(-dt * rate));

    f.t += dt;
    f.flowPhase += dt * p.flow;
    f.spinPhase += dt * p.filSpeed;
    f.orbitPhase += dt * p.partSpeed;
    f.ripplePhase += dt * (3 + f.audio * 7);
    f.ringPhase += dt * p.ringSpeed * (1 + f.audio * 0.8);

    // o cursor é seguido com atraso: a Orb acompanha, não treme
    const follow = 1 - Math.exp(-dt * 3.5);
    f.pointerX += (pointerX - f.pointerX) * follow;
    f.pointerY += (pointerY - f.pointerY) * follow;
    this.breathPhase += dt * p.breathRate;

    f.surge = this.live.surge;
    f.reveal = this.live.reveal;

    // duas senoides de períodos incomensuráveis: a respiração nunca se repete igual
    const b = this.breathPhase * Math.PI * 2;
    const breath = Math.sin(b) + 0.35 * Math.sin(b * 0.618 + 1.3);
    const audioScale = this.reducedMotion ? 0 : p.audioScale;
    f.scale = (0.72 + 0.28 * f.reveal) * (1 + p.breathAmp * breath + f.audio * audioScale + f.surge * 0.012);
    return f;
  }

  dispose() {
    this.surgeCall?.kill();
    gsap.killTweensOf(this.params);
    gsap.killTweensOf(this.live);
  }
}
