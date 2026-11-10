"use client"

import { useState } from "react"
import { MotionConfig } from "motion/react"
import { PainelPassos } from "./painel-passos"
import { MentorForm } from "./mentor-form"

// Junta o painel e o formulário: o formulário avisa o quanto já foi
// preenchido e o painel desenha o caminho de acordo.
export function SolicitacaoMentor() {
  const [progresso, setProgresso] = useState(0)
  const [enviado, setEnviado] = useState(false)

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border bg-card shadow-[0_30px_80px_-30px_rgba(11,20,55,0.45)] md:grid-cols-3">
        <PainelPassos progresso={progresso} enviado={enviado} />
        <div className="p-6 sm:p-10 md:col-span-2">
          <MentorForm
            onProgresso={setProgresso}
            onEnviado={() => setEnviado(true)}
          />
        </div>
      </div>
    </MotionConfig>
  )
}
