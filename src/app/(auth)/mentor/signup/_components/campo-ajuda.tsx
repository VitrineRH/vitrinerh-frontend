"use client"

import { Field, FieldLabel } from "@/components/ui/field"

const LIMITE = 500

type Props = {
  valor: string
  onChange: (valor: string) => void
}

export function CampoAjuda({ valor, onChange }: Props) {
  const restantes = LIMITE - valor.length

  return (
    <Field>
      <FieldLabel htmlFor="ajuda">
        Como você quer ajudar os candidatos?
      </FieldLabel>
      <textarea
        id="ajuda"
        name="como_ajudar"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        maxLength={LIMITE}
        rows={4}
        required
        placeholder="Ex.: revisar currículos de quem está migrando para tecnologia e simular entrevistas para vagas júnior."
        className="min-h-24 w-full resize-none border-0 border-b border-input bg-transparent px-0 py-2 text-base leading-snug outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-blue-500 focus-visible:shadow-[0_1px_0_0_#3b82f6]"
      />
      <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
        <span>Isso aparece no seu perfil para os candidatos.</span>
        <span
          className={`tabular-nums ${restantes <= 50 ? "text-amber-600 dark:text-amber-400" : ""}`}
        >
          {valor.length}/{LIMITE}
        </span>
      </div>
    </Field>
  )
}
