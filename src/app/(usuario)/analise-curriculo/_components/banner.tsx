import { getCurrentUser } from "@/lib/supabase/auth"
import { createClient } from "@/lib/supabase/server"
import {
  HaloCard,
  HaloCardDescription,
  HaloCardHeader,
  HaloCardTitle,
} from "@/components/ui/halo-card"
import Link from "next/link"

const Banner = async () => {
    const user = await getCurrentUser()
    const supabase = await createClient()

    const { count } = await supabase
    .from("curriculo")
    .select("id", { count: "exact", head: true})
    .eq("idperfil", user.id)

    if(count) return null

    return (
        <section>
            <HaloCard 
            aria-label="ainda nao tem curriculo"
            className="max-w-5xl mx-auto">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <HaloCardHeader>
                    <HaloCardTitle> Ainda não tem currículo ou não sabe por onde começar? </HaloCardTitle>
                    <HaloCardDescription> Sem problemas: te mostramos, passo a passo, o que colocar em cada parte - mesmo que seja seu primeiro emprego </HaloCardDescription>
                </HaloCardHeader>
                <Link href="/montar-curriculo"
                className="items-center shrink-0 bg-transparent max-w-46 rounded-xl px-5 py-3 text-sm font-medium border border-foreground/35 hover:bg-foreground/5"
                >
                    Montar meu currículo
                </Link>
                </div>
            </HaloCard>
        </section>
    )
}

export default Banner