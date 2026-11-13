import Link from "next/link";
import type { Filtros, VagaComDados } from "../_lib/tipos";
import { formatarSalario, hrefVagas, rotulo, tempoPublicada } from "../_lib/utils";
import SeloCompatibilidade from "./SeloCompatibilidade";

type Props = {
  vaga: VagaComDados;
  filtros: Filtros;
  selecionada: boolean;
};

export default function CardVaga({ vaga, filtros, selecionada }: Props) {
  const etiquetas = [vaga.modalidade, vaga.regime, vaga.jornada].filter(Boolean);

  return (
    <Link
      href={hrefVagas(filtros, vaga.id)}
      scroll={false}
      aria-current={selecionada ? "true" : undefined}
      className={`flex flex-col gap-2 rounded-[16px] border-[0.5px] bg-white p-5 shadow-[0px_2px_6px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#1a56db] hover:shadow-md ${selecionada ? "border-[#243a6a] ring-1 ring-[#1a56db]" : "border-[#d9d9d9]"
        }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[18px] font-semibold text-[#2d2d2d]">{vaga.titulo}</h3>
        {vaga.compatibilidade !== null && (
          <SeloCompatibilidade valor={vaga.compatibilidade} />
        )}
      </div>

      <p className="text-sm text-[#595959]">
        {vaga.empresas?.nome} · {vaga.cidade}, {vaga.uf}
      </p>

      <div className="flex flex-wrap gap-2">
        {etiquetas.map((etiqueta) => (
          <span
            key={etiqueta}
            className="rounded-[8px] bg-[#f1f3f7] px-2.5 py-1 text-xs font-medium text-[#454545]"
          >
            {rotulo(etiqueta)}
          </span>
        ))}
      </div>

      <p className="text-sm font-medium text-[#2d2d2d]">
        {formatarSalario(vaga.salario_min, vaga.salario_max)}
      </p>

      <div className="flex items-center justify-between text-xs text-[#595959]">
        <span>{tempoPublicada(vaga.publicada_em)}</span>
        {vaga.status === "candidatou" && (
          <span className="font-semibold text-[#1e7b34]">Candidatura enviada</span>
        )}
        {vaga.status === "salva" && (
          <span className="font-semibold text-[#1a56db]">Salva</span>
        )}
      </div>
    </Link>
  );
}
