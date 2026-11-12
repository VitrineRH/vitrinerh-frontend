import { Suspense } from "react";
import ConteudoVagas from "./_components/ConteudoVagas";
import VagasSkeleton from "./_components/VagasSkeleton";

export default function Vagas({ searchParams }: PageProps<"/vagas">) {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<VagasSkeleton />}>
        <ConteudoVagas searchParams={searchParams} />
      </Suspense>
    </div>
  );
}