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
import Botao from "@/components/layout/button"
import { ModeToggle } from "@/components/toggleModo"

const linkClass =
    "relative text-[17px] hover:cursor-pointer after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-foreground after:transition-all after:duration-[600ms] hover:after:w-full"
    //erro por quebra de linha no tailwind

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
            ? "bg-background/70 shadow-sm backdrop-blur-md"
            : "bg-transparent"
        }`}>
            <nav className="mx-auto justify-between items-center flex h-20 px-6 "
            aria-label="Principal">
                <Link href="/">
                <div className="text-2xl text-foreground flex items-center">
                    <Image
                    src={"/images/logo.svg"}
                    alt=""
                    width={70}
                    height={70}
                    className={`brightness-0 dark:invert ${
                        scrolled
                        ? "brightness-0"
                        : "invert"
                    }`}
                    // irei fazer gambiarra nesse classname
                     />
                    <p className={`font-normal ${
                        scrolled
                        ? "text-foreground"
                        : "text-white/90"
                    }`}>Vitrine<span className="font-bold">RH</span></p>
                </div>
                </Link>

                <div className="hidden items-center gap-8 text-[20px] text-foreground md:flex">

                    <Link href="#candidatos" className={linkClass}>
                    Candidato
                    </Link>

                    <NavigationMenu>
                        <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className={linkClass}> Soluções </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-screen gap-2 p-4 md:grid-cols-2">
                                    <li className="grid grid-cols-2 w-[200%] "> {/* Fiz gambiarra aqui por favor nao perguntar */} 
                                        <NavigationMenuLink render={<Link href="/" />} className="p-4 hover:bg-transparent hover:cursor-pointer">
                                                <div className="font-medium">
                                                    Analise de curriculo
                                                </div>
                                                <p className="text-sm text-muted-foreground"> Descubra pontos fortes e oportunidades de melhoria </p>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink render={<Link href="/" />} className="p-4 hover:bg-transparent hover:cursor-pointer">
                                                <div className="font-medium"> Compatibilidade com Vagas </div>
                                                <p> Descubra como seu perfil se encaixa nas oportunidades.</p>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink render={<Link href="" />} className="p-4 hover:bg-transparent hover:cursor-pointer">
                                                <div className="font-medium">
                                                    Preparação de entrevistas
                                                </div>
                                                <p className="text-sm text-muted-foreground"> Pratique entrevistas e receba seu Feedback </p>
                                        </NavigationMenuLink>
                                         <NavigationMenuLink render={<Link href="" />} className="p-4 hover:cursor-pointer hover:bg-transparent">
                                                <div className="font-medium">
                                                    Desenvolvimento profissional
                                                </div>
                                                <p className="text-sm text-muted-foreground"> Encontre cursos e trilhas para evoluir </p>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    <Link href="/como-funciona" className={linkClass}>
                    Como funciona
                    </Link>

                    <Link href="/sobre" className={linkClass}>
                    Sobre
                    </Link>
                </div>


                <div className="flex flex-row gap-6 items-center justify-center">
                <ModeToggle />
                <Link href="/auth">
                <Botao conteudo="Entrar" className="" />
                </Link>
                </div>
            </nav>
        </header>
    )
}

export default Header