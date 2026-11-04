export default function Opcoes() {
    return(
        <div className="flex flex-row justify-evenly mt-3">
            <div className="bg-[#ffffff] p-2 pr-5 rounded-2xl shadow-2xl">
                  <select>
                    <option disabled selected>Acessibilidade</option>
                    <option value="visual">Deficiência visual</option>
                    <option value="auditiva">Deficiência auditiva</option>
                    <option value="motora">Deficiência motora</option>
                    <option value="nenhuma">Nenhuma</option>
                </select>
            </div>
            <div className="bg-[#ffffff] p-2 pr-5 rounded-2xl shadow-2xl">
               <select>
                    <option value="" disabled selected>Formações</option>
                    <option value="visual">Deficiência visual</option>
                    <option value="auditiva">Deficiência auditiva</option>
                    <option value="motora">Deficiência motora</option>
                    <option value="nenhuma">Nenhuma</option>
                </select>
            </div>
            <div className="bg-[#ffffff] p-2 pr-5 rounded-2xl shadow-2xl">
                <select>
                 <option value="" disabled selected>Analises</option>
                    <option value="visual">Deficiência visual</option>
                    <option value="auditiva">Deficiência auditiva</option>
                    <option value="motora">Deficiência motora</option>
                    <option value="nenhuma">Nenhuma</option>
                    </select>
            </div> 
            <div className="bg-[#ffffff] p-2 rounded-2xl shadow-2xl">
               <input type="date" />
            </div>
        </div>
    )
}