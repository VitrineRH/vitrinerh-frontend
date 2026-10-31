import Link from "next/link"

const botoes =
    "rounded-2xl bg-white px-5 py-1.5 border border-black/70 font-medium text-[16px] transition hover:bg-white/65"

type BotaoProps = {
    conteudo: string;
}


const Botao = ({ conteudo }: BotaoProps ) => {
    return (
        <>
            <Link href="/login" className={botoes}>
                 {conteudo}
            </Link>
        </>
    )
}

export default Botao