import { SplitText } from "@/components/ui/split-text"
import { FileText, Clock, Cat, Upload } from "lucide-react"
import Link from "next/link"
import AnalisesRestantes from "./analises-restantes";

type HeaderProps = {
    nomeArquivo?: string | null;
    enviadoEm?: string | null;
    cargoAlvo?: string | null
}

const formatarData = (data: string) =>
    new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "America/Sao_Paulo",
    }).format(new Date(data + "Z"))

const Header = ({ nomeArquivo, enviadoEm, cargoAlvo }: HeaderProps) => {
    return(
        <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex min-w-0 flex-col gap-4">
            <SplitText text="Seu currículo foi analisado" className="text-4xl" immediate/>
            {nomeArquivo && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <FileText className="size-4 shrink-0" />
                    <span className="truncate font-medium text-foreground"> {nomeArquivo} </span>
                    {enviadoEm && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground pl-3">
                        <Clock className="size-4 shrink-0" />
                        <span> Enviado em {formatarData(enviadoEm)}</span>
                        </div>
                    )}
                    {cargoAlvo && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground pl-3">
                            <Cat className="size-4 shrink-0" />
                            <span> Vaga: {cargoAlvo}</span>
                        </div>
                    )}
                </div>
            )}
            </div>

            <div className="flex shrink-0 flex-col items-center gap-3">
                <AnalisesRestantes />
                <Link href="/analise-curriculo" className="py-2 text-sm px-4 border border-foreground/70 rounded-full items-center flex gap-2">
                    <Upload className="size-4 shrink-0"/>
                    Enviar outro currículo
                </Link>
            </div>
        </section>
    )
}

export default Header