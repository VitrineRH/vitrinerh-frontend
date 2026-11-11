"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import PlexusNetworkBackground from "@/components/redeneuralbackground"

const cores = {
    light: { linha: "#000000", no: "#1a56db" },
    dark: { linha: "#3f7bff", no: "#9fe8ff" },
}

const semInscricao = () => () => {}

const Header = () => {
    const { resolvedTheme } = useTheme()
    const montado = useSyncExternalStore(semInscricao, () => true, () => false)
    const tema = resolvedTheme === "dark" ? cores.dark : cores.light

    return (
        <header className="relative isolate overflow-hidden">
            {montado && (
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
                <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                    Análise de currículo
                </h1>
                <p className="text-[15px] leading-6 text-muted-foreground">
                    Descubra seus pontos de destaque, o que melhorar e como evoluir para a área que você deseja.
                </p>
            </div>
        </header>
    )
}

export default Header
