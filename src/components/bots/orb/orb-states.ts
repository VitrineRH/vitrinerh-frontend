export type OrbState = "idle" | "listening" | "thinking" | "speaking";

export type OrbQuality = "low" | "medium" | "high";

/** Valores contínuos que descrevem a "postura" da Orb. O GSAP interpola entre
 *  os presets, então nenhum estado reinicia a cena: só muda o alvo. */
export type OrbParams = {
  /** emissão geral do volume interno */
  intensity: number;
  /** energia do núcleo */
  core: number;
  /** amplitude e frequência da deformação da superfície */
  displace: number;
  dispFreq: number;
  /** velocidade do fluxo interno (ruído) */
  flow: number;
  /** ondas concêntricas na superfície (escuta / fala) */
  ripple: number;
  /** respiração: amplitude e ritmo */
  breathAmp: number;
  breathRate: number;
  /** filamentos: velocidade, brilho e comprimento do rastro */
  filSpeed: number;
  filGlow: number;
  filArc: number;
  /** partículas: velocidade orbital, brilho e quão perto ficam da esfera */
  partSpeed: number;
  partGlow: number;
  partTight: number;
  /** 0 = ciano/azul, 1 = violeta */
  violet: number;
  /** complexidade do movimento interno */
  turbulence: number;
  /** camada externa de vidro e brilho de borda */
  shell: number;
  bloom: number;
  /** quanto o áudio mexe na escala e na luz */
  audioScale: number;
  audioGlow: number;
  /** anéis de pulso ao redor do núcleo: força e velocidade (negativa = para dentro) */
  ring: number;
  ringSpeed: number;
};

export const ORB_PRESETS: Record<OrbState, OrbParams> = {
  idle: {
    intensity: 0.85,
    core: 0.75,
    displace: 0.02,
    dispFreq: 1.1,
    flow: 0.22,
    ripple: 0,
    breathAmp: 0.02,
    breathRate: 0.5,
    filSpeed: 0.32,
    filGlow: 0.5,
    filArc: 0.8,
    partSpeed: 0.25,
    partGlow: 0.6,
    partTight: 0,
    violet: 0.35,
    turbulence: 0.45,
    shell: 0.7,
    bloom: 0.8,
    audioScale: 0,
    audioGlow: 0,
    ring: 0.12,
    ringSpeed: 1.4,
  },
  listening: {
    intensity: 1.0,
    core: 0.9,
    displace: 0.032,
    dispFreq: 1.25,
    flow: 0.4,
    ripple: 0.026,
    breathAmp: 0.028,
    breathRate: 1.0,
    filSpeed: 0.5,
    filGlow: 0.7,
    filArc: 0.7,
    partSpeed: 0.35,
    partGlow: 0.8,
    partTight: 0.25,
    violet: 0.1,
    turbulence: 0.6,
    shell: 1.0,
    bloom: 0.95,
    audioScale: 0.05,
    audioGlow: 0.6,
    ring: 0.4,
    ringSpeed: -6.0,
  },
  thinking: {
    intensity: 1.05,
    core: 1.1,
    displace: 0.044,
    dispFreq: 1.5,
    flow: 1.1,
    ripple: 0,
    breathAmp: 0.012,
    breathRate: 1.7,
    filSpeed: 2.1,
    filGlow: 1.25,
    filArc: 1.25,
    partSpeed: 1.8,
    partGlow: 1.2,
    partTight: 0.55,
    violet: 0.85,
    turbulence: 1.0,
    shell: 0.85,
    bloom: 1.0,
    audioScale: 0,
    audioGlow: 0,
    ring: 0.2,
    ringSpeed: 9.0,
  },
  speaking: {
    intensity: 1.1,
    core: 1.15,
    displace: 0.03,
    dispFreq: 1.2,
    flow: 0.55,
    ripple: 0.012,
    breathAmp: 0.018,
    breathRate: 0.85,
    filSpeed: 0.8,
    filGlow: 0.9,
    filArc: 0.9,
    partSpeed: 0.5,
    partGlow: 0.9,
    partTight: 0.15,
    violet: 0.45,
    turbulence: 0.7,
    shell: 0.9,
    bloom: 1.0,
    audioScale: 0.09,
    audioGlow: 1.0,
    ring: 0.6,
    ringSpeed: 6.5,
  },
};

/** Intervalo (s) entre os "surtos" espontâneos de energia de cada estado. */
export const ORB_SURGE_INTERVAL: Record<OrbState, [number, number]> = {
  idle: [5, 9],
  listening: [3, 6],
  thinking: [0.7, 1.8],
  speaking: [2, 4],
};

export type OrbTier = {
  /** passos do raymarch do volume interno */
  steps: number;
  particles: number;
  filaments: number;
  /** subdivisão da esfera */
  detail: number;
  /** amostras de MSAA do buffer de pós-processamento */
  samples: number;
  maxDpr: number;
};

export const ORB_TIERS: Record<OrbQuality, OrbTier> = {
  low: { steps: 16, particles: 450, filaments: 6, detail: 24, samples: 0, maxDpr: 1 },
  medium: { steps: 28, particles: 1000, filaments: 8, detail: 36, samples: 4, maxDpr: 1.5 },
  high: { steps: 36, particles: 1600, filaments: 11, detail: 48, samples: 4, maxDpr: 2 },
};
