"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"


const Header = () => {

    const [scrolled, setScrolled] = useState(false) // teoricamente irei fazer icar true com 50px

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY >= 400)

        onScroll() // cobre o caso de recarregar a pagina ja rolada/scroladars
        window.addEventListener("scroll", onScroll, { passive: true}) // aqui deixa true
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <header className={`fixed inset-x-0 top-0 z-50 py-1.5 transition-all duration-300 ${
            scrolled
            ? "bg-white/70 shadow-sm backdrop-blur-md"
            : "bg-transparent"
        }`}>
            <nav className="mx-auto justify-between items-center flex h-20 px-6 "
            aria-label="Principal">
                <Link href="/">
                <div className="text-2xl text-black flex items-center">
                    <Image
                    src={"/images/logo.svg"}
                    alt=""
                    width={70}
                    height={70}
                    className="brightness-0"
                    // irei fazer gambiarra nesse classname
                     />
                    Vitrine<span className="font-bold">RH</span>
                </div>
                </Link>

                <div className="hidden items-center gap-8 text-[20px] text-black md:flex">

                    <Link href="/candidatos" className="relative
                    after:absolute after:left-0
                    after:-bottom-1 after:h-[2px] after:w-0
                    after:bg-black after:transition-all
                    after:duration-[600ms] hover:after:w-full">
                    Candidato
                    </Link>

                    <NavigationMenu>
                        <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="relative after:absolute
                            after:left-0 after:-bottom-1 after:h-[2px] after:w-0
                            after:bg-black after:transition-all after:duration-[600ms]
                            hover:after:w-full text-[19px] hover:cursor-pointer"> Soluções </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-2 p-4 md:grid-cols-2">
                                    <li>
                                        <NavigationMenuLink>
                                            <Link href="">
                                                <div className="font-medium">
                                                    Analise de curriculo
                                                </div>
                                                <p className="text-sm text-muted-foreground"> Descubra pontos fortes e oportunidades de melhoria </p>
                                            </Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink>
                                            <Link href="">
                                                <div className="font-medium"> Compatibilidade com Vagas </div>
                                                <p> Descubra como seu perfil se encaixa nas oportunidades.</p>
                                            </Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink>
                                            <Link href="">
                                                <div className="font-medium">
                                                    Preparação de entrevistas
                                                </div>
                                                <p className="text-sm text-muted-foreground"> Pratique entrevistas e receba seu Feedback </p>
                                            </Link>
                                        </NavigationMenuLink>
                                         <NavigationMenuLink>
                                            <Link href="">
                                                <div className="font-medium">
                                                    Desenvolvimento profissional
                                                </div>
                                                <p className="text-sm text-muted-foreground"> Encontre cursos e trilhas para evoluir </p>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    <Link href="/candidatos" className="relative
                    after:absolute after:left-0
                    after:-bottom-1 after:h-[2px] after:w-0
                    after:bg-black after:transition-all
                    after:duration-[600ms] hover:after:w-full">
                    Como funciona
                    </Link>

                    <Link href="/sobre" className="relative
                    after:absolute after:left-0
                    after:-bottom-1 after:h-[2px] after:w-0
                    after:bg-black after:transition-all
                    after:duration-[600ms] hover:after:w-full">
                    Sobre
                    </Link>
                </div>

                <Link href="/login" className="rounded-2xl
                bg-white px-5 py-1.5 border border-black/70 font-medium
                text-[16px] transition hover:bg-white/65">
                    Entrar
                </Link>
            </nav>
        </header>
    )
}

export default Header