import Botao from "@/components/layout/button"
import { SplitText } from "@/components/ui/split-text"
import Link from "next/link"

const Hero = () => {
    return(
        <section className="pt-35 pb-15 grid grid-cols-2 px-17">
            <div className="flex flex-col gap-8 ">
                <SplitText text="Como funciona?" className="text-sm text-muted-foreground"/>
                <SplitText text="Do currículo à entrevista, um passo de cada vez." className="text-8xl font-semibold max-w-3xl"  />
                <SplitText text="Você envia o currículo, descobre onde se encaixa, pratica a entrevista e fecha o que falta. Tudo fica registrado, para você ver a própria evolução."
                className="text-base text-foreground/80 max-w-2xl"/>
                <Link href="#etapas">
                <Botao conteudo="Ver as etapas" className="max-w-xl"/>
                </Link>
            </div>
            <div>
                <video 
                src="/video/video2.mp4"
                width={1000}
                height={1150}
                autoPlay
                muted
                className="rounded-xl w-full h-full object-cover"/>
            </div>
        </section>
    )
}

export default Hero