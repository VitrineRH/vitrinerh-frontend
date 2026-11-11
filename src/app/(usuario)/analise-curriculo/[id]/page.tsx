import { Suspense } from "react"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import VisaoGeral from "./_components/visao-geral"
import Header from "./_components/header"
import Cards from "./_components/cards"
import Section from "./_components/section"

const Page = ({ params }: PageProps<"/analise-curriculo/[id]">) => {
    return(
        <Suspense fallback={<p className="text-muted-foreground"> Carregando análise...</p>}>
            <Resultado params={params}/>
        </Suspense>
    )
}

export default Page

const Resultado = async ({ params }: {params: Promise<{ id: string }> }) => {
    const { id } = await params
    if (!/^\d+$/.test(id)) notFound() 

    const supabase = await createClient()
    const { data: analise } = await supabase
    .from("analise_curriculo")
    .select (`
        id, status, cargo_alvo, empresa_alvo, pontuacao_geral,
        classificacao, resumo, pontos_fortes, pontos_melhoria, criada_em,
        compatibilidade_cargo,
        curriculo ( nome_arquivo, enviado_em ),
        criterio_analise ( criterio, nota ),
        aponta_falta ( habilidade ( nome ) )
        `)
    .eq("id", id)
    .maybeSingle()

    if (!analise) notFound()

    if(analise.status === "processando") return <p> Estamos analisando seu currículo... </p>
    if(analise.status === "erro") return <p> Não conseguimos analisar seu currículo. </p>

    const habilidadesFaltando = analise.aponta_falta
        .map((f: { habilidade: unknown }) => (f.habilidade as { nome?: string } | null)?.nome)
        .filter((nome): nome is string => Boolean(nome))

    return (
        <div className="flex flex-col gap-8">
            <Header
            nomeArquivo={analise.curriculo?.nome_arquivo}
            enviadoEm={analise.curriculo?.enviado_em}
            cargoAlvo={analise.cargo_alvo} />
            <VisaoGeral
            PontuacaoGeral={analise.pontuacao_geral}
            classificacao={analise.classificacao}
            criterios={analise.criterio_analise}
            resumo={analise.resumo}
            cargoAlvo={analise.cargo_alvo}
            empresaAlvo={analise.empresa_alvo} />
            <Cards
            analiseId={analise.id}
            pontosFortes={analise.pontos_fortes}
            pontosMelhoria={analise.pontos_melhoria}
            habilidadesFaltando={habilidadesFaltando}
            compatibilidade={analise.compatibilidade_cargo}
            cargoAlvo={analise.cargo_alvo} />
            <Section
            totalAjustes={analise.pontos_melhoria?.length}
            habilidadesFaltando={habilidadesFaltando}
            cargoAlvo={analise.cargo_alvo} />
        </div>

    )
}
