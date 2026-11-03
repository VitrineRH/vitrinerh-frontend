import Image from "next/image";
import { LogosCarousel } from "@/components/logos-carousel"; 
import { Marquee } from "@/components/ui/marquee"
import { CardSpotlight } from "@/components/ui/card-spotlight"
import { Check } from "lucide-react"
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"
import Botao from "@/components/layout/button";

const fundacoes = [
    { nome: 'Fundação Bradesco', img:  '/documents/Bradesco.jpg'},
    { nome: 'Instituto PROA', img: '/documents/PROA.jpg'},
    { nome: 'Senac', img: '/documents/Senac.svg'},
    { nome: 'Coursera', img: '/documents/Coursera.svg'},
]

const beneficios = [ //estou criando arrays para ficar mais visual
    "Certificado ao concluir cada curso",
    "Exercícios práticos",
    "Recomendações pelo seu perfil e objetivos"
]

const corpoCard = 
    "bg-gray-50 relative group/card hover:cursor-pointer dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-full rounded-xl p-8 border"

const Recursos = () => {    
    return(
        <section className="py-6 px-14">
            <div className="">
            <h2 className="text-4xl"> O que você encontra para se preparar. </h2>
            </div>
            <div className="py-8 grid items-stretch gap-8 grid-cols-1 lg:grid-cols-[1fr_auto]">
                <video 
                src="/video/video1.mp4"
                autoPlay
                muted
                width={1000}
                height={250}
                loop 
                className="h-150 w-320 rounded-3xl object-cover"/>
                <div className="flex flex-col gap-6">
                    <h3 className="text-2xl font-medium"> Entrevistas simuladas por video com IA </h3>
                    <p className="text-sm text-foreground/70"> Você responde como em uma entrevista real. <br/>
                        A IA observa expressões faciais, movimentos rápidos, <br/>
                         inclinações e giros da cabeça e aponta padrões de comportamento que vale ajustar. </p>
                    <Botao conteudo="Incluido no plano premium" className=""/>
                </div>
            </div>
            <div className="grid grid-cols-1 py-6 items-stretch gap-8 lg:grid-cols-2">
            <CardContainer containerClassName="py-0 items-stretch" className="h-full w-full items-stretch">
                <CardBody className={corpoCard}>
                    <CardItem translateZ="50" as="h3" className="text-2xl font-medium">
                        Hub de mentores RH
                    </CardItem>
                    <CardItem translateZ="100" className="w-full mt-4">
                        <Image
                        src="/images/ImagemRH.jpg"
                        alt="Imagem"
                        height={1000}
                        width={1000}
                        className="h-80 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                        />
                    </CardItem>
                    <CardItem translateZ={60} as="p" className="mt-4 text-base text-foreground/70">
                    Profissionais de RH divulgam seus serviços e definem seus preços.
                    Você escolhe quem combina com o seu objetivo e o seu orçamento.
                    </CardItem>
                </CardBody>
            </CardContainer>

                <CardSpotlight className="flex w-full flex-col hover:cursor-pointer">
                    <h3 className="text-xl font-medium relative z-20 mt-2 text-white"> Cursos gratuitos com certificados </h3>
                    <p className="max-w-md text-neutral-200 mt-4 relative z-20"> 
                        Trilhas montadas a partir do seu perfil, das <br/>
                        suas necessidades e da sua faixa etária.
                    </p>
                    <ul className="relative z-20 space-y-3 text-sm text-neutral-300 my-auto">
                    {beneficios.map((b) => (
                        <li key={b} className="flex items-start gap-3">
                            <Check className="mt-0.5 size-4 shrink-0 text-blue-400"/>
                            {b}
                        </li>
                    ))}
                    </ul>
                    <div className="mt-auto">
                        <ul className="flex flex-col gap-2 list-none relative z-20">
                        {fundacoes.map((f) => (
                            <li key={f.nome} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white/90">
                                {f.nome}
                            </li>
                        ))} 
                        </ul>
                    </div>
                </CardSpotlight>

            </div>
            <Marquee
            speed={30}
            fadeEdges={true}
            pauseOnTap={true}
            speedOnHover={15}
            className="h-40 py-6"
            >
                    {fundacoes.map((logo) => (
                        <Image
                        src={logo.img}
                        alt={logo.nome}
                        key={logo.nome}
                        width={160}
                        height={64}
                        className="mx-8 h-16 w-40 object-contain opacity-60 grayscale
                                    transition duration-300 hover:opacity-100 hover:grayscale-0"
                        />
                    ))}
            </Marquee>
        </section>
    )

}

export default Recursos