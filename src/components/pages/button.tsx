
const botoes =
    "rounded-2xl bg-background px-5 py-1.5 border border-foreground/70 font-medium text-[16px] transition hover:bg-background/65 hover:cursor-pointer"

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