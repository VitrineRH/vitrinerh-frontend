import CardAcao from "./_components/CardAcao";
import PrimeirosPassos from "./_components/PrimeirosPassos";
import ProximoCompromisso from "./_components/ProximoCompromisso";
import ProximoPasso from "./_components/ProximoPasso";
import VagasRecomendadas from "./_components/VagasRecomendadas";
import VagasVazias from "./_components/VagasVazias";
import { homeMock } from "./homeMock";

export default function Home() {
  const { temCurriculo, usuario, etapas } = homeMock;
  const estado = temCurriculo ? homeMock.realizar : homeMock.primeiroUso;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-[25px] text-black">
          {estado.saudacao}, {usuario.nome}
        </h1>
        <p className="text-sm text-[#64748b]">{estado.subtitulo}</p>
      </header>

      <div className="grid grid-cols-1 gap-6 min-[1200px]:grid-cols-[minmax(0,1fr)_380px]">
        <ProximoPasso {...estado.proximoPasso} />

        {temCurriculo ? (
          <ProximoCompromisso />
        ) : (
          <PrimeirosPassos etapas={etapas} />
        )}

        {temCurriculo ? <VagasRecomendadas /> : <VagasVazias />}

        <div className="flex flex-col gap-4">
          {estado.cardsLaterais.map((card) => (
            <CardAcao key={card.titulo} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
