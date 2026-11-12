import { connection } from "next/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { buscarVagas } from "../_lib/buscarVagas";
import { lerFiltros } from "../_lib/utils";
import BarraBusca from "./BarraBusca";
import CardVaga from "./CardVaga";
import DetalheVaga from "./DetalheVaga";
import SemVagas from "./SemVagas";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ConteudoVagas({ searchParams }: Props) {
  await connection();
  const filtros = lerFiltros(await searchParams);
  const user = await getCurrentUser();
  const vagas = await buscarVagas(filtros, user.id);

  const selecionada = vagas.find((vaga) => String(vaga.id) === filtros.vaga) ?? vagas[0];
  const abriuDetalhe = filtros.vaga !== "";

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-20 flex flex-col gap-3 bg-background pt-2 pb-6">
        <header>
          <h1 className="text-3xl text-black font-semibold py-1">Vagas</h1>
          <p className="text-sm text-[#64748b] py-[0.2px]">
            Encontre oportunidades que combinam com o seu perfil
          </p>
        </header>

        <BarraBusca key={JSON.stringify(filtros)} filtros={filtros} />

        <p className="text-sm text-[#595959]">
          {vagas.length} {vagas.length === 1 ? "vaga encontrada" : "vagas encontradas"}
        </p>
      </div>

      {vagas.length === 0 ? (
        <SemVagas />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <ul className={`flex flex-col gap-3 ${abriuDetalhe ? "hidden lg:flex" : ""}`}>
            {vagas.map((vaga) => (
              <li key={vaga.id}>
                <CardVaga
                  vaga={vaga}
                  filtros={filtros}
                  selecionada={vaga.id === selecionada.id}
                />
              </li>
            ))}
          </ul>

          <div className={abriuDetalhe ? "" : "hidden lg:block"}>
            <div className="lg:sticky lg:top-[300px]">
              <DetalheVaga vaga={selecionada} filtros={filtros} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
