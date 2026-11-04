export default function Cardrh() {
    return(
        <div className="bg-[#ffffff] border-2 border-[#6a6a6a5a] rounded-3xl flex flex-col items-center w-[330px] pb-3 mt-8 ">
            <div className="mt-5 mb-8">
            <img src="https://files.tecnoblog.net/wp-content/uploads/2019/02/thispersondoesnotexist.jpg" className="size-48 rounded-2xl"/>
            </div>

            <div>


            <div>
                <h2 className="font-bold text-2xl">Renato da Silva Carvalho</h2>
            </div>

            <div>
            <div className="flex flex-row justify-between">
                <h3 className="font-bold">Avaliações:</h3>
                <div className="flex fles-row">
                <label>★</label>
                <p>4,6</p>
                </div>
            </div>
            <div className="flex flex-row justify-between">
                <h3 className="font-bold">Valor:</h3>
                <div className="flex fles-row">
                <label>R$</label>
                <p>150,00</p>
                </div>
            </div>
            <div className="flex flex-col justify-between">
                <h3 className="font-bold">Experiencias:</h3>
                <p>Oracle 2021</p>
                <p>HR Business Partner (HRBP)</p>
            </div>
            <div className="flex flex-col justify-between">
                <h3 className="font-bold">Formações:</h3>
                <div className="flex flex-row justify-between">
                <p className="font-bold">Gestão de Recursos Humanos</p>
                <p className="text-gray-500">FMU</p>
                </div>
                <div className="flex flex-row justify-between">
                <p className="font-bold">Psicologia</p>
                <p className="text-gray-500">Cruzeiro do Sul</p>
                </div>
                
            </div>
            <div className="flex flex-col justify-between">
                <h3 className="font-bold">Idiomas:</h3>
                <p>Inglês</p>
                <p>Português</p>
            </div>
            <div>
            <button className="border-2 border-blue-500 p-3 rounded-2xl">Saber Mais</button>
            </div>
            </div>


            </div>
        </div>
    )
}