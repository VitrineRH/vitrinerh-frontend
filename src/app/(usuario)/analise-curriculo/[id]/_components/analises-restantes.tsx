import getLimiteAnalises from "@/lib/planos"
import { createClient } from "@/lib/supabase/server"

const raio = 7
const circunferencia = 2 * Math.PI * raio

const AnalisesRestantes = async () => {
    const limite = await getLimiteAnalises()
    if( limite === null ) return null

    const supabase = await createClient()

    const agora = new Date()
    const inicioMes = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), 1)).toISOString()

    const { count } = await supabase
    .from("analise_curriculo")
    .select("id", { count: "exact", head: true })
    .gte("criada_em", inicioMes)

    const restante = Math.max(0, limite - (count ?? 0))
    const fracao = restante / limite

    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground max-w-56">
            <svg viewBox="0 0 18 18" className="size-4 -rotate-90">
                <circle cx="9" cy="9" r={raio} fill="none" strokeWidth="2.5" className="stroke-muted" />
                <circle
                    cx="9" cy="9" r={raio} fill="none" strokeWidth="2.5" strokeLinecap="round"
                    className="stroke-blue-600 dark:stroke-blue-400"
                    strokeDasharray={circunferencia}
                    strokeDashoffset={circunferencia * (1 - fracao)}
                />
            </svg>
            Análises restantes:
            <span className="font-medium tabular-nums text-foreground">{restante} de {limite}</span>
        </div>
    )
}


export default AnalisesRestantes