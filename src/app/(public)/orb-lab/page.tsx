"use client";

// Página de teste da Orb. Não faz parte do produto: pode ser apagada depois
// que o componente for integrado à mentoria.

import { useState } from "react";
import { Orb, type OrbState } from "@/components/bots/orb";

const STATES: { value: OrbState; label: string }[] = [
  { value: "idle", label: "Repouso" },
  { value: "listening", label: "Escutando" },
  { value: "thinking", label: "Processando" },
  { value: "speaking", label: "Respondendo" },
];

export default function OrbLabPage() {
  const [state, setState] = useState<OrbState>("idle");
  const [active, setActive] = useState(true);
  const [manualAudio, setManualAudio] = useState(false);
  const [level, setLevel] = useState(0.5);
  const [light, setLight] = useState(false);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-24 ${light ? "bg-white text-slate-700" : "bg-[#05060d] text-slate-200"}`}
    >
      <Orb
        state={state}
        active={active}
        audioLevel={manualAudio ? level : undefined}
        className="w-[min(560px,90vw)]"
      />

      <div className="flex flex-wrap justify-center gap-2">
        {STATES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setState(s.value)}
            aria-pressed={state === s.value}
            className="rounded-full border border-current/20 px-4 py-2 text-sm transition-colors hover:border-current/50 aria-pressed:border-sky-300 aria-pressed:bg-sky-300/10 aria-pressed:text-sky-100"
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 text-sm opacity-70">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={light} onChange={(e) => setLight(e.target.checked)} />
          Fundo claro
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Visível
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={manualAudio} onChange={(e) => setManualAudio(e.target.checked)} />
          Controlar o áudio
        </label>
        <label className="flex items-center gap-2">
          Nível
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={level}
            disabled={!manualAudio}
            onChange={(e) => setLevel(Number(e.target.value))}
          />
        </label>
      </div>
    </main>
  );
}
