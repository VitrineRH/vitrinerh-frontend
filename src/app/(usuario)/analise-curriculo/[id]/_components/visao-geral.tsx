import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { ActivityRingsCard } from "@/components/activity-rings-card"
import { PeriodBarChartCard } from "@/components/period-bar-chart-card"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

type Criterio = {
    criterio: string;
    nota: number;
}

type VisaoGeralProps = {
    PontuacaoGeral?: number;
    classificacao?: string;
    criterios?: Criterio[];
    resumo?: string;
    cargoAlvo?: string;
    empresaAlvo?: string;
}

const vagaAlvo = (cargo?: string, empresa?: string) => {
    if (cargo && empresa) return `Para a vaga de ${cargo} na ${empresa}`
    if (cargo) return `Para a vaga de ${cargo}`
    if (empresa) return `Para vagas na ${empresa}`
    return "Visão geral do seu currículo"
}

const VisaoGeral = ({ PontuacaoGeral, classificacao, criterios = [], resumo, cargoAlvo, empresaAlvo }: VisaoGeralProps ) => {
    const dados = criterios.map(({ criterio, nota }) => ({
        criterio: criterio.split(" ")[0],
        nota,
    }))

    const ordenados = [...criterios].sort((a, b) => b.nota - a.nota)
    const maisForte = ordenados[0]
    const maisFraco = ordenados.at(-1)

    return (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-[20rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)_minmax(0,1fr)]">
            <ActivityRingsCard
            className="h-full w-full"
            title="Pontuação geral"
            size={150}
            thickness={12}
            metrics={[
                {
                    label: "Classificação",
                    value: PontuacaoGeral ?? 0,
                    max: 100,
                    display: classificacao ?? "-",
                    color: "#2563eb",
                },
            ]}
            center={
                <>
                <span className="text-2xl font-semibold tabular-nums">{PontuacaoGeral ?? 0}</span>
                <span className="text-muted-foreground text-xs">de 100</span>
                </>
            }
            />
            {dados.length > 0 && (
                <PeriodBarChartCard
                className="h-full w-full"
                title="Avaliação por critério"
                data={dados}
                xKey="criterio"
                yKey="nota"
                format="number"
                compare={false}
                defaultSelected={maisFraco?.criterio.split(" ")[0]}
                color="#2563eb"
                barWidth={16}
                chartClassName="h-44"
                />
            )}
            {resumo && (
                <Card className="h-full w-full md:col-span-2 xl:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-base">Resumo da análise</CardTitle>
                        <CardDescription>{vagaAlvo(cargoAlvo, empresaAlvo)}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <p className="max-w-prose text-sm leading-relaxed text-foreground/85">{resumo}</p>
                    </CardContent>
                    {maisForte && maisFraco && maisForte !== maisFraco && (
                        <CardFooter className="flex flex-col items-stretch gap-2 border-t pt-4 text-sm">
                            <div className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-2 text-muted-foreground">
                                    <ArrowUpRight className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                                    Ponto mais forte
                                </span>
                                <span className="font-medium">
                                    {maisForte.criterio}
                                    <span className="ml-2 tabular-nums text-muted-foreground">{maisForte.nota}</span>
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-2 text-muted-foreground">
                                    <ArrowDownRight className="size-4 shrink-0 text-orange-600 dark:text-orange-400" />
                                    Precisa de atenção
                                </span>
                                <span className="font-medium">
                                    {maisFraco.criterio}
                                    <span className="ml-2 tabular-nums text-muted-foreground">{maisFraco.nota}</span>
                                </span>
                            </div>
                        </CardFooter>
                    )}
                </Card>
            )}
        </section>
    )
}

export default VisaoGeral
