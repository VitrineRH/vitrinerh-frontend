"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowDown, Check, CircleAlert } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type CardsProps = {
    analiseId: number
    pontosFortes?: string[]
    pontosMelhoria?: string[]
    habilidadesFaltando?: string[]
    compatibilidade?: number | null
    cargoAlvo?: string | null
}

const lerFeitos = (chave: string): string[] => {
    try {
        const salvo = localStorage.getItem(chave)
        return salvo ? JSON.parse(salvo) : []
    } catch {
        return []
    }
}

const salvarFeitos = (chave: string, feitos: string[]) => {
    try {
        localStorage.setItem(chave, JSON.stringify(feitos))
    } catch {}
}

const Cards = ({
    analiseId,
    pontosFortes = [],
    pontosMelhoria = [],
    habilidadesFaltando = [],
    compatibilidade,
    cargoAlvo,
}: CardsProps) => {
    const chave = `analise:${analiseId}:feitos`
    const [feitos, setFeitos] = useState<string[]>([])
    const reduzirMovimento = useReducedMotion()

    useEffect(() => {
        setFeitos(lerFeitos(chave))
    }, [chave])

    const alternar = (item: string) => {
        setFeitos((atual) => {
            const proximo = atual.includes(item) ? atual.filter((i) => i !== item) : [...atual, item]
            salvarFeitos(chave, proximo)
            return proximo
        })
    }

    const totalFeitos = pontosMelhoria.filter((p) => feitos.includes(p)).length
    const tudoFeito = pontosMelhoria.length > 0 && totalFeitos === pontosMelhoria.length

    return (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="text-base">O que já está bom</CardTitle>
                    <CardDescription>
                        {pontosFortes.length} {pontosFortes.length === 1 ? "ponto forte" : "pontos fortes"} no seu currículo
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="flex flex-col gap-3">
                        {pontosFortes.map((ponto) => (
                            <li key={ponto} className="flex items-start gap-3 text-sm">
                                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
                                    <Check className="size-3" strokeWidth={3} />
                                </span>
                                <span className="leading-snug text-foreground/90">{ponto}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="text-base">O que precisa melhorar</CardTitle>
                    <CardDescription aria-live="polite">
                        {tudoFeito
                            ? "Tudo ajustado. Envie a nova versão para ver sua nota subir."
                            : `${totalFeitos} de ${pontosMelhoria.length} ajustes feitos. Marque o que já mudou.`}
                    </CardDescription>
                    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-emerald-500 transition-[width] duration-300 ease-out"
                            style={{ width: `${pontosMelhoria.length ? (totalFeitos / pontosMelhoria.length) * 100 : 0}%` }}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <ul className="flex flex-col gap-1">
                        {pontosMelhoria.map((ponto) => {
                            const feito = feitos.includes(ponto)
                            return (
                                <li key={ponto}>
                                    <button
                                        type="button"
                                        role="checkbox"
                                        aria-checked={feito}
                                        onClick={() => alternar(ponto)}
                                        className="group -mx-2 flex w-[calc(100%+1rem)] cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                                    >
                                        <span
                                            className={cn(
                                                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full transition-colors duration-200",
                                                feito
                                                    ? "bg-emerald-500 text-white"
                                                    : "bg-orange-500/12 text-orange-600 group-hover:bg-orange-500/20 dark:text-orange-400"
                                            )}
                                        >
                                            {feito ? (
                                                <motion.span
                                                    initial={reduzirMovimento ? false : { scale: 0.4 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                                                >
                                                    <Check className="size-3" strokeWidth={3} />
                                                </motion.span>
                                            ) : (
                                                <CircleAlert className="size-3.5" strokeWidth={2.5} />
                                            )}
                                        </span>
                                        <span
                                            className={cn(
                                                "leading-snug transition-colors",
                                                feito ? "text-muted-foreground line-through decoration-muted-foreground/50" : "text-foreground/90"
                                            )}
                                        >
                                            {ponto}
                                        </span>
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </CardContent>
            </Card>

            <Card className="h-full md:col-span-2 xl:col-span-1">
                <CardHeader>
                    <div className="flex items-baseline justify-between gap-3">
                        <CardTitle className="text-base">Compatibilidade com a vaga</CardTitle>
                        {compatibilidade != null && (
                            <span className="text-2xl font-semibold tabular-nums text-blue-700 dark:text-blue-300">
                                {compatibilidade}%
                            </span>
                        )}
                    </div>
                    {cargoAlvo && <CardDescription>{cargoAlvo}</CardDescription>}
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {compatibilidade != null && (
                        <div
                            role="progressbar"
                            aria-label="Compatibilidade com a vaga"
                            aria-valuenow={compatibilidade}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            className="h-2 w-full overflow-hidden rounded-full bg-muted"
                        >
                            <motion.div
                                className="h-full rounded-full bg-blue-600 dark:bg-blue-400"
                                initial={reduzirMovimento ? false : { width: 0 }}
                                animate={{ width: `${compatibilidade}%` }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                            />
                        </div>
                    )}

                    {habilidadesFaltando.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-muted-foreground">
                                {habilidadesFaltando.length === 1
                                    ? "Falta 1 habilidade para esta vaga:"
                                    : `Faltam ${habilidadesFaltando.length} habilidades para esta vaga:`}
                            </p>
                            <ul className="flex flex-wrap gap-2">
                                {habilidadesFaltando.map((habilidade) => (
                                    <li key={habilidade}>
                                        <Link
                                            href={`/cursos?habilidade=${encodeURIComponent(habilidade)}`}
                                            className="inline-flex rounded-full border  px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-blue-600/25 hover:bg-blue-600/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:border-blue-400/30 dark:text-blue-300 dark:hover:bg-blue-400/10"
                                        >
                                            {habilidade}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Seu currículo cobre as habilidades principais desta vaga.</p>
                    )}

                    <Link
                        href="/cursos"
                        className="mt-auto inline-flex items-center gap-1.5 self-start text-sm font-medium text-foreground hover:underline dark:text-blue-300"
                    >
                        Ver cursos para chegar a 100%
                    </Link>
                </CardContent>
            </Card>
        </section>
    )
}

export default Cards
