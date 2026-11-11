import { Suspense } from "react";
import ConteudoVagas from "./_components/ConteudoVagas";
import VagasSkeleton from "./_components/VagasSkeleton";

export default function Vagas({ searchParams }: PageProps<"/vagas">) {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-[25px] text-black">Vagas</h1>
        <p className="text-sm text-[#64748b]">
          Encontre oportunidades que combinam com o seu perfil
        </p>
      </header>

      <Suspense fallback={<VagasSkeleton />}>
        <ConteudoVagas searchParams={searchParams} />
      </Suspense>
    </div>
  );
}