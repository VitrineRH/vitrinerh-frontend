"use client"

import { useRef, useState } from "react"
import { Check } from "lucide-react"

// TODO: troque este texto provisório pelo código de conduta oficial.
const secoes = [
  {
    titulo: "Respeito e acolhimento",
    texto: "[Escreva aqui como o mentor deve tratar os candidatos.]",
  },
  {
    titulo: "Confidencialidade",
    texto: "[Escreva aqui o que o mentor não pode compartilhar.]",
  },
  {
    titulo: "Honestidade sobre sua experiência",
    texto: "[Escreva aqui o que se espera sobre as informações do perfil.]",
  },
  {
    titulo: "O que não é permitido",
    texto: "[Escreva aqui as condutas que levam à remoção da conta.]",
  },
]

type Props = {
  aceito: boolean
  onAceitar: () => void
  onDesfazer: () => void
  erro?: string
}

export function CodigoConduta({ aceito, onAceitar, onDesfazer, erro }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const rolagemRef = useRef<HTMLDivElement>(null)
  const [leuTudo, setLeuTudo] = useState(false)

  // Libera o botão quando a pessoa chega ao fim do texto
  // (ou de cara, se o texto couber sem rolar).
  function verificarLeitura() {
    const el = rolagemRef.current
    if (!el) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) setLeuTudo(true)
  }

  function abrir() {
    setLeuTudo(aceito)
    dialogRef.current?.showModal()
    requestAnimationFrame(verificarLeitura)
  }

  function aceitar() {
    onAceitar()
    dialogRef.current?.close()
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={aceito}
          aria-label="Aceitar o código de conduta para mentores"
          onClick={aceito ? onDesfazer : abrir}
          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
            aceito
              ? "border-blue-500 bg-blue-500 text-white"
              : erro
                ? "border-destructive"
                : "border-input hover:border-blue-300"
          }`}
        >
          {aceito && <Check className="size-3.5" strokeWidth={3} />}
        </button>

        <p className="text-sm leading-snug">
          Li e aceito o{" "}
          <button
            type="button"
            onClick={abrir}
            className="text-blue-600 underline underline-offset-4 hover:text-blue-500 dark:text-blue-400"
          >
            código de conduta para mentores
          </button>
          .
        </p>
      </div>

      {!aceito && !erro && (
        <p className="pl-8 text-xs text-muted-foreground">
          Abra e leia até o final para poder aceitar.
        </p>
      )}
      {erro && (
        <p role="alert" className="pl-8 text-xs text-destructive">
          {erro}
        </p>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="titulo-conduta"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close()
        }}
        className="m-auto w-[min(92vw,34rem)] rounded-2xl border bg-card p-0 text-card-foreground shadow-2xl backdrop:bg-[#0b1437]/60 backdrop:backdrop-blur-sm"
      >
        <header className="border-b p-6 pb-4">
          <h3
            id="titulo-conduta"
            className="font-(family-name:--font-display) text-xl font-semibold tracking-tight"
          >
            Código de conduta para mentores
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Leia até o final para poder aceitar.
          </p>
        </header>

        <div
          ref={rolagemRef}
          onScroll={verificarLeitura}
          className="flex max-h-[50vh] flex-col gap-5 overflow-y-auto p-6 text-sm leading-relaxed"
        >
          {secoes.map((secao) => (
            <section key={secao.titulo}>
              <h4 className="font-medium">{secao.titulo}</h4>
              <p className="mt-1 text-muted-foreground">{secao.texto}</p>
            </section>
          ))}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t p-4">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Fechar
          </button>
          <button
            type="button"
            disabled={!leuTudo}
            onClick={aceitar}
            className="rounded-lg bg-[#0b1437] px-4 py-2 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40 dark:bg-blue-500"
          >
            {leuTudo ? "Li e aceito" : "Role até o final"}
          </button>
        </footer>
      </dialog>
    </div>
  )
}
