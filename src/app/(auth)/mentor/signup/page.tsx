import Link from "next/link"
import { Bricolage_Grotesque } from "next/font/google"
import { SolicitacaoMentor } from "./_components/solicitacao-mentor"

// Fonte dos títulos desta página (os textos corridos seguem na Geist do layout).
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
})

export default function SolicitacaoMentorPage() {
  return (
    <main
      className={`${display.variable} relative z-10 flex min-h-svh flex-col items-center justify-center gap-8 p-6 md:p-10`}
    >
      <span className="font-(family-name:--font-display) text-3xl tracking-tight">
        <span className="font-normal">Vitrine</span>
        <span className="font-bold">RH</span>
      </span>

      <SolicitacaoMentor />

      <p className="text-sm text-muted-foreground">
        Não é mentor?{" "}
        <Link href="/signup" className="text-blue-500 hover:underline">
          Criar conta de candidato
        </Link>
      </p>
    </main>
  )
}
