import Header from "./_Components/header"
import Opcoes from "./_Components/opcoes"
import Cardrh from "./_Components/cardrh"

export default function Agendamento() {
    return(
        <div className="">
            <Header/>
            <div className="">
                <Opcoes/>

            </div>
            <div className=" flex flex-row justify-evenly ">
                <Cardrh/>
                <Cardrh/>
            </div>
        </div>
        
    )
}
// ▼ ⏺ ▼