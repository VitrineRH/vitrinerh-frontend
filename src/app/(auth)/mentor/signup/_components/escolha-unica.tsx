"use client"

import { useId } from "react"
import { motion } from "motion/react"
import { Check } from "lucide-react"

type Props = {
  rotulo: string
  name: string
  opcoes: string[]
  valor: string
  onChange: (valor: string) => void
  /**
   * segmentado = faixa única com marcador deslizante
   * chips = botões soltos
   * escala = régua: uma linha que se enche até a opção escolhida
   */
  variante?: "segmentado" | "chips" | "escala"
  erro?: string
}

const setas: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
}

export function EscolhaUnica({
  rotulo,
  name,
  opcoes,
  valor,
  onChange,
  variante = "segmentado",
  erro,
}: Props) {
  const id = useId()
  const rotuloId = `${id}-rotulo`
  const segmentado = variante === "segmentado"
  const escala = variante === "escala"

  const indice = opcoes.indexOf(valor)
  const total = opcoes.length

  // Setas do teclado trocam a opção, como em qualquer grupo de rádio.
  function teclado(e: React.KeyboardEvent<HTMLButtonElement>, i: number) {
    const passo = setas[e.key]
    if (!passo) return
    e.preventDefault()
    const proxima = (i + passo + total) % total
    onChange(opcoes[proxima])
    e.currentTarget
      .closest<HTMLElement>('[role="radiogroup"]')
      ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
      [proxima]?.focus()
  }

  const classeDoGrupo = escala
    ? "relative grid pt-1"
    : segmentado
      ? "grid grid-cols-2 gap-1 rounded-xl bg-muted p-1 sm:grid-cols-4"
      : "flex flex-wrap gap-2"

  return (
    <div className="flex flex-col gap-2">
      <span
        id={rotuloId}
        className="flex w-fit items-center gap-2 text-sm font-medium leading-snug"
      >
        {rotulo}
      </span>

      <div
        role="radiogroup"
        aria-labelledby={rotuloId}
        aria-invalid={Boolean(erro)}
        className={classeDoGrupo}
        style={
          escala
            ? { gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }
            : undefined
        }
      >
        {escala && (
          <span
            aria-hidden
            className="absolute top-[calc(0.25rem+7px)] h-px bg-border"
            style={{ left: `${50 / total}%`, right: `${50 / total}%` }}
          >
            <motion.span
              className="block h-full w-full origin-left bg-blue-500"
              initial={false}
              animate={{ scaleX: indice > 0 ? indice / (total - 1) : 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 24 }}
            />
          </span>
        )}

        {opcoes.map((opcao, i) => {
          const ativo = opcao === valor
          const alcancado = indice >= 0 && i <= indice
          // Só um botão do grupo entra na ordem do Tab.
          const tabIndex = ativo || (!valor && i === 0) ? 0 : -1

          return (
            <button
              key={opcao}
              type="button"
              role="radio"
              aria-checked={ativo}
              tabIndex={tabIndex}
              onClick={() => onChange(opcao)}
              onKeyDown={(e) => teclado(e, i)}
              className={
                escala
                  ? "relative flex flex-col items-center gap-2 rounded-md pb-1 outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                  : segmentado
                    ? `relative rounded-lg px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
                        ativo
                          ? "font-medium text-[#13265e] dark:text-blue-200"
                          : "text-muted-foreground hover:text-foreground"
                      }`
                    : `rounded-full border px-4 py-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
                        ativo
                          ? "border-[#0b1437] bg-[#0b1437] text-white dark:border-blue-400 dark:bg-blue-500"
                          : "border-input hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                      }`
              }
            >
              {escala && (
                <>
                  <span
                    className={`relative z-10 size-3.5 rounded-full border-2 transition-all duration-300 ${
                      alcancado
                        ? "border-blue-500 bg-blue-500"
                        : "border-border bg-card"
                    } ${ativo ? "scale-125 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]" : ""}`}
                  />
                  <span
                    className={`text-sm transition-colors ${
                      ativo
                        ? "font-medium text-[#13265e] dark:text-blue-200"
                        : "text-muted-foreground"
                    }`}
                  >
                    {opcao}
                  </span>
                </>
              )}

              {segmentado && ativo && (
                <motion.span
                  layoutId={id}
                  className="absolute inset-0 rounded-lg bg-background shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              {!escala && (
                <span className="relative flex items-center justify-center gap-1.5">
                  {!segmentado && ativo && <Check className="size-3.5" />}
                  {opcao}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {erro && (
        <p role="alert" className="text-xs text-destructive">
          {erro}
        </p>
      )}

      <input type="hidden" name={name} value={valor} />
    </div>
  )
}
