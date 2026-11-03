import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const gratuito = [
    {
        id: 1,
        icon: Check,
        conteudo: "5 análises de currículo por mês, com devolutivas e vagas personalizadas"
    },
    {
        id: 2,
        icon: Check,
        conteudo: "Perguntas complementares após a análise"
    },
    {
        id: 3,
        icon: Check,
        conteudo: "Trilha de aprendizagens gratuitas"
    }
]

const pagos = [
    {
        id: 1,
        icon: Check,
        conteudo: "Tudo do plano gratuito"
    },
    {
        id: 2,
        icon: Check,
        conteudo: "Historico completo de evolução"
    },
    {
        id: 3,
        icon: Check,
        conteudo: "Mentor de IA, 30 conversas por mês"
    },
    {
        id: 4,
        icon: Check,
        conteudo: "Compatibilidade ilimitada com vagas"
    }
]



const Section = () => {
    return (
        <section className="grid grid-cols-3 gap-15 px-17 py-25 bg-foreground">
            <div className="flex flex-col gap-8">
                <h2 className="text-8xl max-w-2xl text-accent"> Você comeca sem pagar nada. </h2>
                <p className="text-sm text-accent/70"> A versão gratuita já cobre a análise do currículo e as trilhas de cursos. O plano Pro amplia o histórico e libera o mentor de IA. </p>
            </div>
            <div>
                <Card className="h-full">
                    <CardHeader>
                    <CardTitle> Gratís </CardTitle>
                    <CardDescription className="text-7xl text-foreground pb-10"> R$ 0 <span className="text-base text-foreground ">/mês</span> </CardDescription>
                    </CardHeader>

                    {gratuito.map(({ id, icon: Icon, conteudo}) => (
                        <CardPanel key={id} className="flex items-start gap-3">
                        <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
                        <span className="text-sm"> {conteudo} </span>    
                        </CardPanel>
                    ))}
                </Card>
            </div>
            <div>
                <Card className="h-full">
                    <CardHeader>
                    <CardTitle> Premium </CardTitle>
                    <CardDescription className="text-7xl text-foreground pb-6"> R$ 110,00 <span className="text-base text-foreground ">/mês</span></CardDescription>
                    </CardHeader>

                    {pagos.map(({ id, icon: Icon, conteudo}) => (
                        <CardPanel key={id} className="flex items-start gap-3">
                        <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
                        <span className="text-sm"> {conteudo} </span>    
                        </CardPanel>
                    ))}
                </Card>
            </div>
        </section>
    )
}

export default Section