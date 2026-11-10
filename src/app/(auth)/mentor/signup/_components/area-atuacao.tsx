"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { campoFoco } from "./estilo-campo"

const areas = [
  "Recursos Humanos",
  "Tecnologia",
  "Marketing",
  "Vendas",
  "Finanças",
]

type Props = {
  valor: string
  onChange: (valor: string) => void
}

export function AreaAtuacao({ valor, onChange }: Props) {
  const [aberta, setAberta] = useState(false)

  const texto = valor.trim()
  const sugestoes = areas.filter((area) =>
    area.toLowerCase().includes(texto.toLowerCase())
  )
  const jaExiste = areas.some(
    (area) => area.toLowerCase() === texto.toLowerCase()
  )
  const mostrarOutra = texto.length > 0 && !jaExiste

  function escolher(area: string) {
    onChange(area)
    setAberta(false)
  }

  return (
    <Field className="relative">
      <FieldLabel htmlFor="area">Área de atuação</FieldLabel>
      <Input
        id="area"
        name="area_atuacao"
        value={valor}
        onChange={(e) => {
          onChange(e.target.value)
          setAberta(true)
        }}
        onFocus={() => setAberta(true)}
        onBlur={() => setAberta(false)}
        placeholder="Ex.: Recursos Humanos"
        autoComplete="off"
        required
        className={campoFoco}
      />

      {aberta && (sugestoes.length > 0 || mostrarOutra) && (
        <ul className="absolute top-full z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-blue-950/10 bg-popover p-1.5 shadow-[0_14px_32px_-14px_rgba(11,20,55,0.35)] animate-in fade-in-0 slide-in-from-top-1 duration-150 dark:border-white/10">
          {sugestoes.map((area) => {
            const selecionada = area === valor
            return (
              <li key={area}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    escolher(area)
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-500/10 ${
                    selecionada
                      ? "font-medium text-[#13265e] dark:text-blue-300"
                      : ""
                  }`}
                >
                  {area}
                  {selecionada && <Check className="size-4 text-blue-500" />}
                </button>
              </li>
            )
          })}

          {mostrarOutra && (
            <li
              className={sugestoes.length > 0 ? "mt-1 border-t pt-1" : undefined}
            >
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  setAberta(false)
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-blue-50 dark:hover:bg-blue-500/10"
              >
                Usar “
                <span className="font-medium text-foreground">{texto}</span>”
              </button>
            </li>
          )}
        </ul>
      )}
    </Field>
  )
}
