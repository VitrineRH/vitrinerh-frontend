import Botao from "@/components/pages/button"
import PixelCard from "@/components/PixelCard"
import { Check, Sparkles, Rocket } from "lucide-react"
import Link from "next/link"


const planos = [
    {
        nome: "Gratuito",
        icone: Sparkles,
        destaque: false,
        descricao: "Para conhecer a plataforma e dar os primeiros passos",
        preco: "R$ 0",
        beneficios: [
            "5 Analises de curriculo por mês com devolutivas e vagas personalizadas",
            "Perguntas complementares após a analise com sugestões de cursos",
            "Trilha de aprendizado gratuita"
        ]
    },
    {
        nome: "Premium",
        icone: Rocket,
        destaque: true,
        descricao: "Para quem quer acompanhar a evolução de perto",
        preco: "R$ 110",
        beneficios: [
            "Tudo do plano gratuito",
            "Historico completo de evolução",
            "Mentor de IA (30 conversas/mês)",
            "Compatibilidade ilimitada com vagas"
        ]
    }
]

const Precos = () => {
    return (
        <section className="justify-center text-center py-12 bg-white px-6">
            <div className="flex flex-col gap-3 py-4">
                <h2 className="text-4xl"> Comece gratis e evolua no seu ritmo </h2>
                <p className="text-lg text-black/70 max-w-3xl mx-auto"> a versão gratuita permite experimentar as analises basicas. Os planos pagos ampliam o historico e liberam o mentor de inteligencia artificial </p>
            </div>
            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
                {planos.map((p) => (
                <PixelCard
                    key={p.nome}
                    colors={["#93c5fd", "#3b82f6", "#1d4ed8"]}
                    glowColor="#2563eb"
                    shape="circle"
                    origin="center"
                    gap={6}
                    pixelSize={1.5}
                    speed={35}
                    revealDuration={600}
                    spotlight={0.5}
                    glow={0.5}
                    opacity={p.destaque ? 0.5 : 0.35}
                    fade={0.6}
                    trigger={p.destaque ? "always" : "hover"}
                    radius={24}
                    clickPulse
                    intro={p.destaque}
                    theme="light"
                    className="h-full w-full! place-items-stretch"
                >
                 <div className="flex h-full flex-col gap-4 p-6 text-left">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold"> {p.nome} </h3>
                        {p.destaque && <span className="ml-auto text-sm"> Popular </span>}
                    </div>
                    <p className="text-5xl font-semibold">
                        {p.preco}
                        <span className="ml-1 text-base font-normal text-black/50">/mês</span>
                    </p>
                    <p className="text-black/60"> {p.descricao} </p>
                    <ul className="flex flex-col gap-3 text-sm text-black/80">
                        {p.beneficios.map((b) => (
                            <li key={b} className="flex items-start gap-3">
                                <Check className="mt-0.5 size-4 shrink-0 text-blue-500"/>
                                {b}
                            </li>
                        ))}
                    </ul>
                    <Link href="/" className="mt-auto pt-6">
                        <Botao conteudo="Ficar com este!" />
                    </Link>
                 </div>
                </PixelCard>
                ))}
            </div>
        </section>
    )
}

export default Precos