import Link from "next/link"
import { Bot, FilePen, GraduationCap, Users, type LucideIcon } from "lucide-react"
import {
    HaloCard,
    HaloCardAction,
    HaloCardButton,
    HaloCardDescription,
    HaloCardFooter,
    HaloCardHeader,
    HaloCardTitle,
} from "@/components/ui/halo-card"

type SectionProps = {
    totalAjustes?: number
    habilidadesFaltando?: string[]
    cargoAlvo?: string | null
}

type Passo = {
    icone: LucideIcon
    titulo: string
    descricao: string
    acao: string
    href: string
    principal?: boolean
}

const listar = (itens: string[]) =>
    itens.length <= 1 ? itens.join("") : `${itens.slice(0, -1).join(", ")} e ${itens.at(-1)}`

const Section = ({ totalAjustes = 0, habilidadesFaltando = [], cargoAlvo }: SectionProps) => {
    const vaga = cargoAlvo ? `de ${cargoAlvo}` : "que você quer"

    const passos: Passo[] = [
        {
            icone: FilePen,
            titulo: "Ajuste o currículo",
            descricao: totalAjustes
                ? `Faça os ${totalAjustes} ajustes da lista acima e envie a nova versão para comparar a nota.`
                : "Seu currículo já está bem resolvido. Envie uma nova versão quando atualizar algo.",
            acao: "Enviar nova versão",
            href: "/analise-curriculo",
            principal: true,
        },
        {
            icone: GraduationCap,
            titulo: "Aprenda o que falta",
            descricao: habilidadesFaltando.length
                ? `Cursos gratuitos com certificado de ${listar(habilidadesFaltando)}.`
                : "Continue evoluindo com trilhas gratuitas e certificado.",
            acao: "Ver cursos",
            href: "/cursos",
        },
        {
            icone: Bot,
            titulo: "Treine a entrevista",
            descricao: `Simule uma entrevista para a vaga ${vaga} e receba uma devolutiva de cada resposta.`,
            acao: "Começar simulação",
            href: "/entrevista-ia",
        },
        {
            icone: Users,
            titulo: "Converse com o RH",
            descricao: "Agende uma conversa com uma pessoa de RH para revisar seu currículo junto com você.",
            acao: "Ver mentores",
            href: "/mentores-rh",
        },
    ]

    return (
        <section aria-labelledby="proximos-passos" className="flex flex-col gap-5 pt-4">
            <div className="flex flex-col gap-1">
                <h2 id="proximos-passos" className="text-2xl font-semibold tracking-tight">
                    Seus próximos passos
                </h2>
                <p className="text-sm text-muted-foreground">
                    Um caminho em quatro etapas para chegar mais preparado na vaga {vaga}.
                </p>
            </div>

            <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {passos.map(({ icone: Icone, titulo, descricao, acao, href, principal }, indice) => (
                    <li key={titulo} className="flex">
                        <HaloCard aria-label={titulo} className="flex">
                            <HaloCardHeader>
                                <span className="mb-3 grid size-10 place-items-center rounded-xl">
                                    <Icone className="size-5" />
                                </span>
                                <HaloCardAction>
                                    <span className="text-sm font-semibold tabular-nums text-muted-foreground/70">
                                        {indice + 1}
                                    </span>
                                </HaloCardAction>
                                <HaloCardTitle className="col-start-1 row-start-2 text-base">{titulo}</HaloCardTitle>
                                <HaloCardDescription className="col-start-1 row-start-3 min-h-15">
                                    {descricao}
                                </HaloCardDescription>
                            </HaloCardHeader>
                            <HaloCardFooter className="mt-auto justify-start">
                                <HaloCardButton
                                    variant={principal ? "primary" : "secondary"}
                                    nativeButton={false}
                                    render={<Link href={href} />}
                                >
                                    {acao}
                                </HaloCardButton>
                            </HaloCardFooter>
                        </HaloCard>
                    </li>
                ))}
            </ol>
        </section>
    )
}

export default Section
