import { ProcessCardsTimeline } from "@/components/timeline-process-cards"
import { Meteors } from "@/components/ui/meteors"

const passos = [
    {
        id: "curriculo",
        title: "Envie seu currículo",
        description: "A análise aponta seus pontos fortes, o que ajustar na apresentação e as palavras-chave que estão faltando."
    },
    {
        id: "encaixa",
        title: "Veja onde você se encaixa",
        description: "Compare seu perfil com os requisitos de cada vaga e entenda o que você já atende e o que falta desenvolver."
    },
    {
        id: "pratique",
        title: "Pratique a entrevista",
        description: "Responda como numa entrevista real. A IA observa expressões, movimentos e postura e devolve o que vale ajustar."
    },
    {
        id: "lacunas",
        title: "Feche as lacunas",
        description: "Receba trilhas de cursos gratuitos com certificado, montadas a partir do que a vaga pede e você ainda não tem."
    },
    {
        id: "mentores",
        title: "Evolua com mentores de RH",
        description: "Profissionais de RH ajudam a planejar os próximos passos, e seu progresso fica registrado a cada etapa."
    }
]

const Etapas = () => {
    return(
        <section className="bg-[#F4F4F4] py-17 gap-10 grid grid-cols-[1.3fr_1fr] px-17" id="etapas">
            <div className="flex flex-col gap-4">
                <ProcessCardsTimeline
                title="Cinco etapas, na ordem em que você vai usar."
                steps={passos}
                stackOffset={24} />
            </div>
            <div>
                <p className="text-4xl max-w-2xl text-black font-semibold pt-24"> Cada etapa responde a uma dúvida comum de quem está buscando emprego. Você pode voltar a qualquer uma delas quando quiser. </p>
                <div className="relative h-[500px] w-full overflow-hidden">
                <Meteors />
                </div>
            </div>
        </section>
    )
}

export default Etapas