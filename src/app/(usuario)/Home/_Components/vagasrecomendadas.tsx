export default function Vagasrecomendadas() {
    return(
        <>
        <div className="p-3 pl-5 pr-5 m-5 bg-[#ffffff] flex-col border-2 border-[#D9D9D9] rounded-xl shadow-2xl max-w-3xl"> {/* w-fit */}
            <div className="flex flex-row content-between justify-between">
                <div>
                <p className="font-bold">Vagas recomendadas para você</p>
                </div>
                <div>
                <button className="text-[#1A56DB] ml-4 cursor-pointer">Explorar todas as vagas</button>
                </div>
            </div>
            <div className="mb-3">
            <h3 className="text-[20px] font-bold">Suas vagas aparecem aqui depois da análise</h3>
            <p>Comparamos seu currículo com as vagas abertas e mostramos primeiro as que têm mais chance de dar certo.</p>
            </div>
            {/* <div>
                <div>
                D
                </div>
            </div> */}
            <div>
                <div className="flex flex-row pt-4 content-between justify-between border-t-2 border-[#E5E5E5] mb-4">
                    <div>
                        <p className="bg-[#E2E6EE] rounded-lg text-[#ffffff00] w-[350px]">_</p>
                        <p className="bg-[#EEF1F5] rounded-lg text-[#ffffff00] w-[200px]">_</p>
                        </div>
                    <div>
                        <button className="bg-[#F1F3F7] p-2 rounded-lg text-gray-400">--Compativel</button>
                    </div>
                </div>
            </div>
            <div>
                 <div className="flex flex-row pt-4 content-between justify-between border-t-2 border-[#E5E5E5] mb-4">
                    <div>
                        <p className="bg-[#E2E6EE] rounded-lg text-[#ffffff00] w-[350px]">_</p>
                        <p className="bg-[#EEF1F5] rounded-lg text-[#ffffff00] w-[200px]">_</p>
                        </div>
                    <div>
                        <button className="bg-[#F1F3F7] p-2 rounded-lg text-gray-400">--Compativel</button>
                    </div>
                </div>
            </div>
            <div>
                <div className="flex flex-row pt-4 content-between justify-between border-t-2 border-[#E5E5E5] mb-4">
                    <div>
                        <p className="bg-[#E2E6EE] rounded-lg text-[#ffffff00] w-[350px]">_</p>
                        <p className="bg-[#EEF1F5] rounded-lg text-[#ffffff00] w-[200px]">_</p>
                        </div>
                    <div>
                        <button className="bg-[#F1F3F7] p-2 rounded-lg text-gray-400">--Compativel</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
// ▼ ⏺ ▼