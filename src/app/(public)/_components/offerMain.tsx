import { ScrollTimeline,
    ScrollTimelineItem
 } from "@/components/ui/scroll-timeline"
 import { Flag } from "lucide-react"


 const lancar = [
    { nome: 'Análise de currículo', conteudo: 'Sugestões personalizadas para o seu currículo, da apresentação das informações às palavras-chave, explicando o que mudou e por quê.'},
    { nome: 'Compatibilidade com vagas', conteudo: 'Compare seu perfil aos requisitos de cada vaga e veja o que você já atende e o que falta desenvolver.'},
    { nome: 'Feedback', conteudo: 'Devolutivas claras sobre o seu desempenho, no lugar do silêncio depois de um processo seletivo.'},
    { nome: 'Cursos e trilhas', conteudo: 'Desenvolva as competências que faltam para a vaga com cursos gratuitos com certificado, exercícios práticos e recomendações personalizadas ao seu perfil e aos seus objetivos.'},
    { nome: 'Mentoria e evolução', conteudo: 'Profissionais de RH ajudam você a planejar os próximos passos, e seu progresso fica registrado a cada etapa.'}
 ]
const Oferecemos = () => {
    return(
        <section className="py-20 bg-white">
            <h1 className="text-4xl pl-32 pb-16"> O que oferecemos? </h1>
            <div className="grid grid-cols-2 px-20">
                <div className="h-[575px] overflow-y-auto rounded-xl border p-6 py-8 shadow-lg border-black/40">
                    <ScrollTimeline activationLine={0.70}>
                        {lancar.map((l) => (
                        <ScrollTimelineItem key={l.nome} title={l.nome}>
                            {l.conteudo}
                        </ScrollTimelineItem>
                        ))}
                    </ScrollTimeline>
                </div>
            </div>
        </section>
    )
}

export default Oferecemos