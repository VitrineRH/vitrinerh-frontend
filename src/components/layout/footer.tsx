import Image from "next/image"
import Link from "next/link"

type Item = {
    texto: string
    href?: string
}

type Coluna = {
    titulo: string
    largura: string
    itens: Item[]
}

const colunas: Coluna[] = [
    {
        titulo: "PARA CANDIDATOS",
        largura: "w-[230px]",
        itens: [
            { texto: "Buscar Vagas" },
            { texto: "Meu Painel" },
            { texto: "Mentor IA" },
            { texto: "Criar Conta Grátis", href: "/signup" },
        ],
    },
    {
        titulo: "PARA EMPRESAS",
        largura: "w-[230px]",
        itens: [
            { texto: "Banco de Talentos" },
            { texto: "Divulgar uma Vaga" },
            { texto: "Planos" },
        ],
    },
    {
        titulo: "INSTITUCIONAL",
        largura: "w-[157px]",
        itens: [
            { texto: "Quem somos", href: "/sobre" },
            { texto: "Privacidade e transparência" },
        ],
    },
    {
        titulo: "CONTATO",
        largura: "w-[197px]",
        itens: [
            { texto: "contato@vitrineRH.com", href: "mailto:contato@vitrineRH.com" },
        ],
    },
]


export default function Footer() {
    return (
        <footer className={`flex flex-col gap-6 bg-background px-6 py-12 text-[12px] leading-[15px] font-semibold text-foreground md:px-[86px]`}>
            <div className="flex flex-wrap- justify-between gap-y-8 border-border pb-[30px]">

                <div className="flex w-[183px] flex-col gap-[30px]">
                    <div className="flex flex-col gap-[9px]">
                        <p className="text-foreground ">VitrineRH</p>
                        <p>Seu caminho para um futuro melhor.</p>
                    </div>

                    <div className="flex items-center gap-[15px]">
                        <div className="flex items-center gap-3">
                            <Image src="/icons/instagram.svg" alt="Instagram" width={22} height={22} className="brightness-0 dark:invert" />
                            <Image src="/icons/linkedin.svg" alt="LinkedIn" width={18} height={20} className="-translate-y-px brightness-0 dark:invert" />
                        </div>
                    </div>
                </div>

                {colunas.map((coluna) => (
                    <div key={coluna.titulo} className={`flex ${coluna.largura} flex-col gap-[9px]`}>
                        <p className="text-foreground">{coluna.titulo}</p>

                        {coluna.itens.map((item) =>
                            item.href ? (
                                <Link key={item.texto} href={item.href}>{item.texto}</Link>
                            ) : (
                                <p key={item.texto}>{item.texto}</p>
                            )
                        )}
                    </div>
                ))}

                <div className="flex w-[127px] flex-col items-center gap-[30px]">
                    <div className="flex flex-col items-center gap-[9px]">
                        <p>Acessibilidade</p>
                        <p>A+ A  A-</p>
                    </div>

                    <div className="flex items-center gap-[19px]">
                        <Image src="/icons/vlibras.svg" alt="" width={28} height={23} className="brightness-0 dark:invert" />
                        <p className="whitespace-nowrap [text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]">VLibras</p>
                    </div>
                </div>
            </div>
                        
                <p className="text-[#64748b]">
                    © 2026 VitrineRH. Todos os direitos reservados.
                </p>
        </footer>
    )
}