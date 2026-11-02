
const botoes =
    "rounded-2xl bg-white px-5 py-1.5 border border-black/70 font-medium text-[16px] transition hover:bg-white/65 hover:cursor-pointer"

type BotaoProps = {
    conteudo: string;
}


const Botao = ({ conteudo }: BotaoProps ) => {
    return (
        <>
            <button className={botoes}>
                 {conteudo}
            </button>
        </>
    )
}

export default Botao