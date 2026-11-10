"use client"

import Link from "next/link"
import { ChevronDown, Handshake, UserPlus } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

const opcoes = [
    {
        href: "/auth",
        titulo: "Canditado",
        descricao: "Encontre oportunidades",
        Icone: UserPlus,
    },
    {
        href: "/mentor/signup",
        titulo: "Mentor",
        descricao: "Acompanhe profissionais",
        Icone: Handshake
    }
]

const Menutrigger = 
    "group inline-flex items-center gap-1.5 rounded-2xl border border-foreground/70 px-5 py-1.5 text-base font-medium transition-colors duration-200 outline-none hover:cursor-pointer hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[popup-open]:bg-foreground data-[popup-open]:text-background"

const span =
    "grid size-9 shrink-0 place-items-center rounded-lg transition-colors duration-150 group-data-[highlighted]/dropdown-menu-item:border-foreground group-data-[highlighted]/dropdown-menu-item:bg-background group-data-[highlighted]/dropdown-menu-item:text-background!"

const Entrar = () => {
    return(
        <DropdownMenu>
            <DropdownMenuTrigger className={Menutrigger}>
                Entrar
                <ChevronDown className="size-4 transition-transform duration-200 group-data-[popup-open]:rotate-180 motion-reduce:transition-none" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
            align="end"
            sideOffset={10}
            className="w-72 rounded-2xl p-2 shadow-xl shadow-black/5">
                {opcoes.map(({ href, titulo, descricao, Icone}) => (
                    <DropdownMenuItem
                    key={href}
                    render={<Link href={href} />}
                    className="cursor-pointer items-start gap-3 rounded-xl p-2.5"
                    >
                        <span className={span}>
                            <Icone className="size-4" />
                        </span>
                        <div className="flex flex-col gap-0.5">
                            <span className="font-medium"> {titulo} </span>
                            <span className="text-xs text-muted-foreground"> {descricao} </span>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Entrar