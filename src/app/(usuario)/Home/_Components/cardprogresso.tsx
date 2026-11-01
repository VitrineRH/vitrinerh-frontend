export default function CardProgresso() {
    return(
        <>
        <div className="p-3 pl-5 pr-5 m-5 bg-[#0F1B3D] flex-col rounded-xl shadow-2xl max-w-3xl">
            <div>
                <p className="text-[#ffffff] opacity-70 text-[14px]">Primeiro passo, 1 de 4</p>
                <h2 className="text-2xl text-[#ffffff] mt-1">Envie seu currículo e receba sua primeira análise</h2>
                <p className="text-[#ffffff] opacity-70 text-[14px] mt-1">Leva cerca de 2 minutos. Lemos sua experiência e mostramos o que ajustar para vagas de entrada, com exemplos.</p>
                <progress value={10} max={100} className="rounded-xl mt-2"></progress>
            </div>
            <div className="pt-2 flex flex-row">
                <div><button className="bg-[#ffffff] rounded-xl p-3 cursor-pointer mt-1">Enviar meu currículo</button></div>
                <div><button className="border-2 border-white rounded-xl p-3 text-white ml-4 cursor-pointer mt-1">Montar do zero</button></div>
            </div>
        </div>
        </>
    )
}
// ▼ ⏺ ▼