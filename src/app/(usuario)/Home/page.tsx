import Boasvindas from "./_Components/boasvindas"
import CardProgresso from "./_Components/cardprogresso"
import Vagasrecomendadas from "./_Components/vagasrecomendadas"
import Primeirospassos from "./_Components/primeirospassos"
import Treine from "./_Components/treineparaproxima"
import Trilha from "./_Components/conhecatrilha"

export default function Principal() {
    return(
        <div className="flex flex-row justify-center">
            <div className="content-center ml-5">
                <Boasvindas/>
                <CardProgresso/>
                <Vagasrecomendadas/>
            </div>
            <div className="content-center ml-5">
                <Primeirospassos/>
                <Treine/>
                <Trilha/>
            </div>
        </div>
        
    )
}
// ▼ ⏺ ▼