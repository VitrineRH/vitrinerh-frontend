import { ScrollTextHighlight } from "@/components/ui/scroll-text-highlight"
import { Fragment } from "react"

//fazer outro array para mudança rapida
const listaDescricao = [
    { title: "Missão", paragraph: "Transformar a falta de retorno em orientação e a insegurança em evolução para quem busca uma colocação no mercado de trabalho"},
    { title: "Visão", paragraph: "Ser a plataforma onde cada etapa da busca por emprego vira aprendizado, aproximando talentos em evolução das empresas que procuram por eles"},
    { title: "Valores", paragraph: "Clareza, aprendizado contínuo, acesso e respeito à pessoa guiam nosso processo. Dizemos com franqueza o que melhorar, cada etapa é uma chance de evoluir, oferecemos cursos gratuitos e planos acessíveis, e tratamos o candidato como alguém em desenvolvimento, não como um número."}
]

const Acreditamos = () => {
    return (
        <section className="py-18 px-16 grid grid-cols-[1.5fr_2fr] gap-10 bg-[#f5f5f5]">
            <div className="flex flex-col gap-6">
                <h4 className="text-6xl max-w-sm">
                    No que acreditamos
                </h4>
                <p className="text-lg text-black/70">
                    Uma rejeição não define o potencial de ninguém. Por trás de cada currículo existe uma pessoa com objetivos e vontade de crescer.
                </p>
            </div>
            <div className="py-4">
                {/* Por favor nao tocar aqui por que eu tambem nao sei o que esta acontecendo */}
                {listaDescricao.map((l) => (
                    <Fragment key={l.title}>
                        <div className="grid grid-cols-[0.3fr_2fr] border-y p-8 justify-center">
                        <ScrollTextHighlight 
                        text={l.title}
                        className="text-2xl leading-relaxed font-semibold"/>
                        <div>
                            <ScrollTextHighlight
                            text={l.paragraph}
                            className="text-lg leading-relaxed font-light" />
                        </div>
                        </div>
                    </Fragment>
                ))}
            </div>
        </section>
    )
}

export default Acreditamos