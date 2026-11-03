import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const perguntas = [
    {
        id: "pagar",
        pergunta: "Preciso pagar para começar?",
        resposta:
            "Não. O plano gratuito inclui 5 análises de currículo por mês, perguntas complementares e a trilha de aprendizagens gratuitas.",
    },
    {
        id: "certificado",
        pergunta: "Os cursos têm certificado?",
        resposta: "Sim. Ao concluir um curso você recebe um certificado de conclusão.",
    },
    {
        id: "entrevista",
        pergunta: "Como funciona a entrevista simulada?",
        resposta:
            "Você responde a perguntas de uma vaga e recebe devolutivas sobre o que ajustar. Tudo fica registrado no seu histórico de evolução.",
    },
    {
        id: "mentores",
        pergunta: "Quem são os mentores?",
        resposta:
            "Profissionais de RH que acompanham a sua evolução. No plano Premium você também conta com o mentor de IA.",
    },
]

const Faq = () => {
    return (
        <section className="grid grid-cols-3 gap-15 px-17 py-25">
            <h2 className="text-4xl font-light"> Dúvidas comuns </h2>
            <div className="col-span-2 max-w-2xl">
                <Accordion>
                    {perguntas.map(({ id, pergunta, resposta }) => (
                        <AccordionItem key={id} value={id}>
                            <AccordionTrigger> {pergunta} </AccordionTrigger>
                            <AccordionContent> {resposta} </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}

export default Faq
