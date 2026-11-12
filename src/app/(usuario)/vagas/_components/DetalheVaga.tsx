import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Wallet } from "lucide-react";
import type { Filtros, VagaComDados } from "../_lib/tipos";
import { formatarSalario, hrefVagas, rotulo, tempoPublicada } from "../_lib/utils";
import BotaoCandidatar from "./BotaoCandidatar";
import BotaoSalvar from "./BotaoSalvar";
import SeloCompatibilidade from "./SeloCompatibilidade";

type Props = {
  vaga: VagaComDados;
  filtros: Filtros;
};
export default function DetalheVaga({ vaga, filtros }: Props) {
  const etiquetas = [vaga.modalidade, vaga.regime, vaga.jornada].filter(Boolean);

  return (
    <article className="flex flex-col gap-5 rounded-[16px] border border-[#d9d9d9] bg-white p-6 shadow-[0px_2px_6px_rgba(0,0,0,0.06)]  lg:overflow-y-auto">
      <Link
        href={hrefVagas(filtros)}
        className="inline-flex items-center gap-1 text-sm font-medium text-[#1a56db] lg:hidden"
      >
        <ArrowLeft className="size-4" aria-hidden /> Voltar para a lista
      </Link>

      <header className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[22px] font-semibold text-[#0f1b3d]">{vaga.titulo}</h2>
          {vaga.compatibilidade !== null && (
            <SeloCompatibilidade valor={vaga.compatibilidade} />
          )}
        </div>
        <ul className="flex flex-col gap-1.5 text-sm text-[#454545]">
          <li className="flex items-center gap-2">
            <Building2 className="size-4" aria-hidden />
            {vaga.empresas?.site_empresa_url ? (
              <a
                href={vaga.empresas.site_empresa_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1a56db] hover:underline"
              >
                {vaga.empresas.nome}
              </a>
            ) : (
              vaga.empresas?.nome
            )}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4" aria-hidden />
            {vaga.cidade}, {vaga.uf}
          </li>
          <li className="flex items-center gap-2">
            <Wallet className="size-4" aria-hidden />
            {formatarSalario(vaga.salario_min, vaga.salario_max)}
          </li>
        </ul>
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

        <p className="text-xs text-[#595959]">{tempoPublicada(vaga.publicada_em)}</p>
      </header>

      <div className="flex flex-wrap items-start gap-3">
        <BotaoCandidatar
          idVaga={vaga.id}
          url={vaga.url_candidatura}
          jaCandidatou={vaga.status === "candidatou"}
        />
        <BotaoSalvar
          idVaga={vaga.id}
          salva={vaga.status === "salva"}
          desabilitado={vaga.status === "candidatou"}
        />
      </div>

      <hr className="border-[#e5e5e5]" />

      <Secao titulo="Descrição da vaga" texto={vaga.descricao} />
      <Secao titulo="Requisitos" texto={vaga.requisitos} />
      <Secao titulo="Benefícios" texto={vaga.beneficios} />
    </article>
  );
}

function Secao({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-base font-semibold text-black">{titulo}</h3>
      <p className="text-sm leading-relaxed whitespace-pre-line text-[#454545]">{texto}</p>
    </section>
  );
}

