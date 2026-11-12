const animacao = "transition-all duration-500 ease-out motion-reduce:transition-none [transform-box:fill-box]"

const onda = [14, 22, 9, 26, 18, 6, 12, 28, 20, 10, 24, 16, 7, 21, 27, 13, 8, 19, 25, 11, 6, 17, 23, 15, 9, 26, 20, 12, 7, 18, 24, 10, 14, 8]

const olhar = [
    { x: 14, y: 25, r: 3 },
    { x: 40, y: 13, r: 5 },
    { x: 64, y: 27, r: 2.5 },
    { x: 93, y: 17, r: 6 },
    { x: 121, y: 29, r: 3 },
    { x: 149, y: 14, r: 4 },
    { x: 180, y: 23, r: 5 },
]

const SinalOlhar = () => {
    return (
        <>
            <polyline
            points={olhar.map((ponto) => `${ponto.x},${ponto.y}`).join(" ")}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.6}
            />
            {olhar.map((ponto, i) => (
                <circle
                key={i}
                cx={ponto.x}
                cy={ponto.y}
                r={ponto.r}
                fill="currentColor"
                fillOpacity={0.35}
                stroke="currentColor"
                className={`${animacao} origin-center scale-90 group-hover/etapa:scale-100`}
                />
            ))}
        </>
    )
}

const SinalVoz = () => {
    return (
        <>
            {onda.map((altura, i) => (
                <rect
                key={i}
                x={4 + i * 5.8}
                y={20 - altura / 2}
                width={2.6}
                height={altura}
                rx={1.3}
                fill="currentColor"
                className={`${animacao} origin-center scale-y-[0.65] group-hover/etapa:scale-y-100`}
                />
            ))}
        </>
    )
}

const SinalTexto = () => {
    return (
        <g className={`${animacao} origin-left scale-x-[0.75] group-hover/etapa:scale-x-100`} fill="currentColor">
            <rect x={4} y={11} width={34} height={5} rx={2.5} />
            <rect x={44} y={11} width={18} height={5} rx={2.5} />
            <rect x={68} y={11} width={46} height={5} rx={2.5} />
            <rect x={120} y={11} width={22} height={5} rx={2.5} />
            <rect x={148} y={11} width={30} height={5} rx={2.5} />
            <rect x={4} y={23} width={26} height={5} rx={2.5} />
            <rect x={36} y={23} width={40} height={5} rx={2.5} />
            <rect x={82} y={23} width={14} height={5} rx={2.5} />
            <rect x={102} y={23} width={36} height={5} rx={2.5} />
        </g>
    )
}

const SinalEvolucao = () => {
    return (
        <>
            <line x1={4} y1={36} x2={196} y2={36} stroke="currentColor" strokeOpacity={0.3} />
            <polyline
            points="6,32 34,27 62,30 90,22 118,24 146,15 174,17 194,7"
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1 1"
            className={`${animacao} [stroke-dashoffset:0.3] group-hover/etapa:[stroke-dashoffset:0]`}
            />
            <circle cx={194} cy={7} r={3} fill="currentColor" className={`${animacao} opacity-0 group-hover/etapa:opacity-100`} />
        </>
    )
}

const etapas = [
    {
        titulo: "Leitura inicial",
        texto: "Antes das perguntas, o Orbe observa padrões como olhar e movimentos de cabeça. Nada é gravado.",
        sinal: <SinalOlhar />,
    },
    {
        titulo: "Perguntas por voz",
        texto: "O Orbe faz as perguntas em voz alta, em português, com base na vaga e no seu currículo.",
        sinal: <SinalVoz />,
    },
    {
        titulo: "Respostas registradas",
        texto: "A IA transcreve e organiza o que você disse, pergunta por pergunta.",
        sinal: <SinalTexto />,
    },
    {
        titulo: "Feedback e histórico",
        texto: "Você recebe seus pontos fortes e o que melhorar. Tudo vai para o histórico da Análise de currículo.",
        sinal: <SinalEvolucao />,
    },
]

const trilha = "flex h-[4.5rem] items-center rounded-xl border border-border bg-muted/40 px-4 transition-colors duration-500 group-hover/etapa:bg-blue-600/5 dark:group-hover/etapa:bg-sky-300/6 lg:rounded-none lg:border-l-0 lg:-mr-6 lg:group-first/etapa:rounded-l-xl lg:group-first/etapa:border-l lg:group-last/etapa:rounded-r-xl"

const ComoFuncionamento = () => {
    return (
        <section className="py-14">
            <h2 className="mb-8 text-2xl font-light tracking-tight text-foreground"> Como funciona </h2>

            <ol className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-0">
                {etapas.map((etapa, i) => (
                    <li key={etapa.titulo} className="group/etapa lg:pr-6">
                        <div aria-hidden className={trilha}>
                            <svg viewBox="0 0 200 40" className="h-12 w-full text-foreground/40 transition-colors duration-500 group-hover/etapa:text-blue-600 dark:group-hover/etapa:text-sky-300 hover:cursor-pointer">
                                {etapa.sinal}
                            </svg>
                        </div>

                        <h3 className="mt-5 flex items-baseline gap-2.5 text-sm font-medium text-foreground">
                            <span className="font-normal text-muted-foreground">{i + 1}</span>
                            {etapa.titulo}
                        </h3>
                        <p className="mt-2 max-w-[34ch] text-sm leading-6 text-muted-foreground"> {etapa.texto} </p>
                    </li>
                ))}
            </ol>
        </section>
    )
}

export default ComoFuncionamento
