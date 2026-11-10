"use client"

import { motion } from "motion/react"
import { Check } from "lucide-react"

const passos = [
  { titulo: "Você envia a solicitação", texto: "Leva uns 3 minutos." },
  {
    titulo: "Nosso time analisa seu perfil",
    texto: "Conferimos LinkedIn e experiência em até 2 dias úteis.",
  },
  {
    titulo: "A autorização chega no seu email",
    texto: "Com o link para ativar sua conta de mentor.",
  },
]

const beneficios = [
  "Revisar currículos dos candidatos",
  "Abrir horários na Agenda",
  "Acompanhar quem você mentora",
]

type Props = {
  /** de 0 a 1: quanto do formulário já foi preenchido */
  progresso: number
  enviado: boolean
}

const mola = { type: "spring", stiffness: 110, damping: 20 } as const

export function PainelPassos({ progresso, enviado }: Props) {
  // Enquanto preenche, a pessoa está no passo 1. Depois de enviar, no passo 2.
  const atual = enviado ? 1 : 0
  const porcentagem = Math.round(progresso * 100)

  function textoDoPasso(i: number) {
    if (i === 0 && enviado) return "Recebemos sua solicitação."
    if (i === 0 && porcentagem > 0) return `${porcentagem}% preenchido`
    if (i === 1 && enviado) return "Estamos olhando seu perfil agora."
    return passos[i].texto
  }

  // Quanto da linha entre o passo i e o seguinte está desenhada.
  function preenchimento(i: number) {
    if (i < atual) return 1
    if (i === atual && i === 0) return progresso
    return 0
  }

  return (
    <aside
      className="relative flex flex-col gap-9 overflow-hidden p-8 text-white"
      style={{
        backgroundImage:
          "radial-gradient(120% 55% at 0% 0%, rgba(59,108,240,0.38), transparent 60%), linear-gradient(180deg, #0b1437 0%, #13265e 100%)",
      }}
    >
      {/* a "vitrine": o arco de uma janela de loja, com um reflexo */}
      <svg
        aria-hidden
        viewBox="0 0 320 440"
        preserveAspectRatio="xMidYMax meet"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-auto w-full text-blue-200"
      >
        <path
          d="M24 440 V160 a136 136 0 0 1 272 0 V440"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="1"
        />
        <path
          d="M40 440 V160 a120 120 0 0 1 240 0 V440"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="1"
        />
        <path
          d="M64 440 L172 176 L202 176 L94 440 Z"
          fill="currentColor"
          fillOpacity="0.05"
        />
      </svg>

      <div className="relative">
        <h2 className="font-(family-name:--font-display) text-[1.9rem] font-semibold leading-[1.05] tracking-tight">
          Seu caminho até a mentoria
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          Cada mentor é aprovado por uma pessoa do nosso time. Assim os
          candidatos sabem com quem estão falando.
        </p>
      </div>

      <ol className="relative flex flex-col">
        {passos.map((passo, i) => {
          const feito = i < atual
          const ativo = i === atual
          const ultimo = i === passos.length - 1

          return (
            <li
              key={passo.titulo}
              aria-current={ativo ? "step" : undefined}
              className="relative flex gap-4 pb-9 last:pb-0"
            >
              {!ultimo && (
                <span
                  aria-hidden
                  className="absolute bottom-0 left-3.5 top-7 w-px -translate-x-1/2 bg-white/15"
                >
                  <motion.span
                    className="block h-full w-full origin-top bg-linear-to-b from-blue-400 to-sky-200"
                    initial={false}
                    animate={{ scaleY: preenchimento(i) }}
                    transition={mola}
                  />
                </span>
              )}

              <span
                className={`relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors duration-300 ${
                  feito
                    ? "border-blue-400 bg-blue-400 text-[#0b1437]"
                    : ativo
                      ? "border-blue-400 bg-blue-500 shadow-[0_0_0_4px_rgba(96,165,250,0.22)]"
                      : "border-white/25 text-white/60"
                }`}
              >
                {feito ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
              </span>

              <div>
                <p className="text-sm font-medium">{passo.titulo}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-white/70">
                  {textoDoPasso(i)}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="relative mt-auto border-t border-white/15 pt-5">
        <p className="text-sm font-medium">Depois de aprovado, você pode</p>
        <ul className="mt-3 flex flex-col gap-2.5">
          {beneficios.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-sm text-white/80"
            >
              <Check className="size-3.5 shrink-0 text-blue-300" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
