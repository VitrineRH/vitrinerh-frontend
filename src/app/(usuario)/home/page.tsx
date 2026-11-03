import { Suspense } from "react";
import { getCurrentUser } from "@/lib/supabase/auth";
import CardAcao from "./_components/CardAcao";
import PrimeirosPassos from "./_components/PrimeirosPassos";
import ProximoCompromisso from "./_components/ProximoCompromisso";
import ProximoPasso from "./_components/ProximoPasso";
import VagasRecomendadas from "./_components/VagasRecomendadas";
import VagasVazias from "./_components/VagasVazias";
import { homeMock } from "./homeMock";

async function Saudacao({ saudacao }: { saudacao: string }) {
  const user = await getCurrentUser();
  const nome = user.user_metadata.full_name || user.email;

  return (
    <h1 className="text-[25px] text-black">
      {saudacao}, {nome}
    </h1>
  );
}

export default function Home() {
  const { temCurriculo, etapas } = homeMock;
  const estado = temCurriculo ? homeMock.realizar : homeMock.primeiroUso;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <Suspense fallback={<div className="h-8 w-64 rounded-md bg-gray-200 animate-pulse" />}>
          <Saudacao saudacao={estado.saudacao} />
        </Suspense>
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
