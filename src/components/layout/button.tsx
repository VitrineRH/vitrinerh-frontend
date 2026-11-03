
const botoes =
    "rounded-2xl bg-background px-5 py-1.5 border border-foreground/70 font-medium text-[16px] transition hover:bg-background/65 hover:cursor-pointer"

type BotaoProps = {
    conteudo: string;
    className: string;
}


const Botao = ({ conteudo, className }: BotaoProps ) => {
    return (
        <>
            <button className={`${botoes} ${className ?? ""}`}>
                 {conteudo}
            </button>
        </>
    )
}

export default Botao