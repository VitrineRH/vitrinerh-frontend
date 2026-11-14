"use client"

import { Orb, type OrbState } from "@/components/bots/orb/Orb"
import React, { useState } from "react"

const states: { value: OrbState; label: string }[] = [
  { value: "idle", label: "Repouso" },
  { value: "listening", label: "Escutando" },
  { value: "thinking", label: "Processando" },
  { value: "speaking", label: "Respondendo" },
];

const Screen = () => {

    const [state, setState] = useState<OrbState>("idle");
    const [active, setActive] = useState(true);
    const [manualAudio, setManualAudio] = useState(false);
    const [level, setLevel] = useState(0.5);

    return (
    <section
      className={"flex min-h-screen flex-col items-center justify-center gap-8 py-24"}
    >
      <Orb
        state={state}
        active={active}
        audioLevel={manualAudio ? level : undefined}
        className="w-[min(560px,90vw)]"
      />

        <div className="flex flex-wrap justify-center gap-2">
        {states.map((s) => (
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


        </section>
    )
}

export default Screen