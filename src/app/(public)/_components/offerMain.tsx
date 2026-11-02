import { ScrollTimeline,
    ScrollTimelineItem
 } from "@/components/ui/scroll-timeline"
 import { Bot, File, FileCheckCorner } from "lucide-react"
import Image from "next/image"
import { OrbitingCircles } from "@/components/magicui/orbiting-circles"


 const lancar = [
    { nome: 'Análise de currículo', conteudo: 'Sugestões personalizadas para o seu currículo, da apresentação das informações às palavras-chave, explicando o que mudou e por quê.'},
    { nome: 'Compatibilidade com vagas', conteudo: 'Compare seu perfil aos requisitos de cada vaga e veja o que você já atende e o que falta desenvolver.'},
    { nome: 'Feedback', conteudo: 'Devolutivas claras sobre o seu desempenho, no lugar do silêncio depois de um processo seletivo.'},
    { nome: 'Cursos e trilhas', conteudo: 'Desenvolva as competências que faltam para a vaga com cursos gratuitos com certificado, exercícios práticos e recomendações personalizadas ao seu perfil e aos seus objetivos.'},
    { nome: 'Mentoria e evolução', conteudo: 'Profissionais de RH ajudam você a planejar os próximos passos, e seu progresso fica registrado a cada etapa.'}
 ]
 
const Oferecemos = () => {
    return(
        <section className="py-20 bg-background">
            <h1 className="text-4xl pl-32 pb-16"> O que oferecemos? </h1>
            <div className="grid grid-cols-2 px-20">
                <div className="h-[575px] overflow-y-auto rounded-xl border p-6 py-8 shadow-lg border-foreground/40">
                    <ScrollTimeline activationLine={0.70}>
                        {lancar.map((l) => (
                        <ScrollTimelineItem key={l.nome} title={l.nome}>
                            {l.conteudo}
                        </ScrollTimelineItem>
                        ))}
                    </ScrollTimeline>
                </div>
                <div className="pl-18">
                    <h3 className="text-2xl text-foreground/70 pb-2">
                        Tudo para evoluir na carreira. Valorize seu perfil, desenvolva suas competências e prepare-se para a próxima oportunidade. <br/>
                        Cada etapa responde a uma dúvida comum, para você não enfrentar essa jornada sozinho. 
                    </h3>
                    <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden">
                        <OrbitingCircles>
                            <File/>
                            <Image
                            src="/images/logo.svg"
                            alt="logo"
                            width={50}
                            height={50}
                            className="brightness-0 dark:invert"
                            />
                            <FileCheckCorner/>
                        </OrbitingCircles>
                        <OrbitingCircles radius={100} reverse>
                            <File/>
                            <Bot/>
                        </OrbitingCircles>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Oferecemos