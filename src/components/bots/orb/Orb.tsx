"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import { cn } from "@/lib/utils";
import { OrbMotion } from "./orb-motion";
import { OrbRig } from "./orb-rig";
import { ORB_TIERS, type OrbQuality, type OrbState, type OrbTier } from "./orb-states";

export type OrbProps = {
  /** estado da IA; a troca é sempre interpolada, nunca reinicia a cena */
  state?: OrbState;
  /** nível de áudio de 0 a 1: um número, ou uma função lida a cada quadro
   *  (ex.: um AnalyserNode) para não re-renderizar o React. Sem essa prop, a
   *  Orb simula um envelope de fala nos estados `listening` e `speaking`. */
  audioLevel?: number | (() => number);
  /** `false` faz a animação de saída; `true`, a de entrada */
  active?: boolean;
  /** a Orb inclina de leve em direção ao cursor (ignorado em telas de toque
   *  e com `prefers-reduced-motion`) */
  interactive?: boolean;
  /** `auto` escolhe pelo dispositivo e ainda reduz o custo se o FPS cair */
  quality?: OrbQuality | "auto";
  /** descrição para leitores de tela */
  label?: string;
  className?: string;
};

type Environment = { quality: OrbQuality; reducedMotion: boolean; hover: boolean };

function detectEnvironment(): Environment {
  if (typeof window === "undefined") return { quality: "medium", reducedMotion: false, hover: false };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const mobile = window.matchMedia("(pointer: coarse)").matches;
  let quality: OrbQuality = "high";
  if (mobile || cores <= 6 || memory <= 4) quality = "medium";
  if (cores <= 4 && (mobile || memory <= 4)) quality = "low";
  return { quality, reducedMotion, hover: window.matchMedia("(hover: hover)").matches };
}

type StageProps = {
  state: OrbState;
  audioLevel: OrbProps["audioLevel"];
  active: boolean;
  tier: OrbTier;
  reducedMotion: boolean;
  pointer: RefObject<{ x: number; y: number }>;
  onSlow: () => void;
};

// Vive dentro do <Canvas>: cria a cena e o controle de animação, e assume o
// render (prioridade 1) para passar pelo pós-processamento.
function OrbStage({ state, audioLevel, active, tier, reducedMotion, pointer, onSlow }: StageProps) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const get = useThree((s) => s.get);
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);
  const dpr = useThree((s) => s.viewport.dpr);

  const rigRef = useRef<OrbRig | null>(null);
  const motionRef = useRef<OrbMotion | null>(null);
  const latest = useRef({ state, audioLevel, active, onSlow });
  const perf = useRef({ frames: 0, time: 0, drops: 0 });

  useEffect(() => {
    latest.current = { state, audioLevel, active, onSlow };
  });

  useEffect(() => {
    const rig = new OrbRig(gl, scene, camera as PerspectiveCamera, tier);
    const motion = new OrbMotion(reducedMotion, latest.current.state);
    const { size, viewport } = get();
    rig.resize(size.width, size.height, viewport.dpr);
    rigRef.current = rig;
    motionRef.current = motion;
    perf.current = { frames: 0, time: 0, drops: 0 };
    return () => {
      rigRef.current = null;
      motionRef.current = null;
      motion.dispose();
      rig.dispose();
    };
  }, [gl, scene, camera, get, tier, reducedMotion]);

  useEffect(() => {
    rigRef.current?.resize(width, height, dpr);
  }, [width, height, dpr]);

  useFrame((_, delta) => {
    const rig = rigRef.current;
    const motion = motionRef.current;
    if (!rig || !motion) return;
    const now = latest.current;
    motion.setState(now.state);
    motion.setActive(now.active);
    const level = typeof now.audioLevel === "function" ? now.audioLevel() : now.audioLevel;
    rig.update(motion.tick(delta, level, pointer.current.x, pointer.current.y));
    rig.render(delta);

    // Se a média de 120 quadros ficar abaixo de ~40 fps, corta passos do
    // raymarch e pede menos resolução. No máximo duas vezes; nunca volta a subir.
    // Quadros acima de 100 ms são a aba em segundo plano ou a página carregando,
    // não a GPU: eles reiniciam a janela em vez de contar.
    const p = perf.current;
    if (p.drops < 2 && now.active) {
      if (delta > 0.1) {
        p.frames = 0;
        p.time = 0;
      } else {
        p.frames += 1;
        if (p.frames > 60) p.time += delta;
        if (p.frames >= 180) {
          if (p.time / 120 > 1 / 40) {
            p.drops += 1;
            rig.setSteps(Math.max(8, Math.round(rig.getSteps() * 0.7)));
            now.onSlow();
          }
          p.frames = 0;
          p.time = 0;
        }
      }
    }
  }, 1);

  return null;
}

/** Orb 3D que representa a IA da mentoria. Preenche o container (por padrão,
 *  um quadrado da largura disponível) e desenha sobre fundo transparente:
 *  foi pensada para superfícies escuras. */
export function Orb({
  state = "idle",
  audioLevel,
  active = true,
  interactive = true,
  quality = "auto",
  label = "Mentor de IA",
  className,
}: OrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [environment] = useState(detectEnvironment);
  const [visible, setVisible] = useState(true);
  const [dprScale, setDprScale] = useState(1);

  // Fora da tela, o loop de render para.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // O canvas não recebe eventos; o cursor é lido na janela e medido em relação
  // ao centro da Orb, então ela reage mesmo com o ponteiro longe dela.
  const pointer = useRef({ x: 0, y: 0 });
  const follow = interactive && environment.hover && !environment.reducedMotion;
  useEffect(() => {
    if (!follow) return;
    const target = pointer.current;
    const onMove = (event: PointerEvent) => {
      const element = containerRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const reach = Math.max(window.innerWidth, window.innerHeight) / 2;
      target.x = Math.max(-1, Math.min(1, (event.clientX - (rect.left + rect.width / 2)) / reach));
      target.y = Math.max(-1, Math.min(1, (event.clientY - (rect.top + rect.height / 2)) / reach));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      target.x = 0;
      target.y = 0;
    };
  }, [follow]);

  const tier = ORB_TIERS[quality === "auto" ? environment.quality : quality];

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={label}
      data-orb-state={state}
      className={cn("relative aspect-square w-full", className)}
    >
      <Canvas
        flat
        frameloop={visible ? "always" : "never"}
        dpr={[0.5, tier.maxDpr * dprScale]}
        camera={{ fov: 32, near: 0.1, far: 60, position: [0, 0, 7] }}
        gl={{ antialias: false, alpha: true, stencil: false, powerPreference: "high-performance" }}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <OrbStage
          state={state}
          audioLevel={audioLevel}
          active={active}
          tier={tier}
          reducedMotion={environment.reducedMotion}
          pointer={pointer}
          onSlow={() => setDprScale((scale) => Math.max(0.6, scale * 0.8))}
        />
      </Canvas>
    </div>
  );
}
