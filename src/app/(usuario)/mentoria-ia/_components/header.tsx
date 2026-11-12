"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import PlexusNetworkBackground from "@/components/redeneuralbackground"

const cores = {
    light: { linha: "#000000", no: "#1a56db" },
    dark: { linha: "#3f7bff", no: "#9fe8ff" }
}

const semInscricao = () => () => {}

const Header = () => {

    const { resolvedTheme } = useTheme()
    const montado = useSyncExternalStore(semInscricao, () => true, () => false)
    const tema = resolvedTheme === "dark" ? cores.dark : cores.light

    return (
        <section className="relative isolate overflow-hidden pb-2">
            { montado && (
                <div aria-hidden className="absolute inset-0 -z-10">
                    <PlexusNetworkBackground
                    lineColor={tema.linha}
                    nodeColor={tema.no}
                    scale={5}
                    speed={0.5}
                    />
                </div>
            )}
            <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-linear-to-r from-background via-background/80 to-transparent"
            />
            <div className="flex min-h-60 max-w-xl flex-col justify-center gap-3 py-10">
            <h1 className="text-3xl text-semibold text-foreground font-light tracking-tight md:text-3xl"> Entrevista com IA </h1>
            <p className="text-base leading-6 text-muted-foreground"> Treine com o Orbe, seu mentor de IA. Ele faz as perguntas em voz alta, registra suas respostas e, no final, te devolve um feedback com o que foi bem e o que ainda precisa melhorar </p>
           </div>
        </section>
    )
}

export default Header