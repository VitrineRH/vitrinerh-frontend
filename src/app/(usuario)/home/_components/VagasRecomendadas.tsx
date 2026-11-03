import Link from "next/link";
import { Bookmark} from "lucide-react";

const vagas = [
  {
    id: 1,
    titulo: "Desenvolvedor Front-end Júnior",
    local: "Nuvio Tecnologia, São Paulo, SP (híbrido)",
    compatibilidade: 92,
  },
  {
    id: 2,
    titulo: "Estágio em Desenvolvimento Web",
    local: "Pixel Labs, Campinas, SP (presencial)",
    compatibilidade: 85,
  },
  {
    id: 3,
    titulo: "Analista de Suporte Júnior",
    local: "Conecta Serviços, Santo André, SP (remoto)",
    compatibilidade: 64,
  },
];

export default function VagasRecomendadas() {
  return (
    <section className="flex flex-col gap-1 self-start rounded-[16px] border border-[#d9d9d9] bg-white px-6 pt-5 pb-3 shadow-[0px_2px_6px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between gap-4 pb-2">
        <h2 className="text-base font-semibold text-black">
          Vagas recomendadas para você
        </h2>
        <Link
          href="/vagas"
          className="shrink-0 text-sm font-medium text-[#1a56db] hover:underline"
        >
          Ver todas as vagas
        </Link>
      </div>

      <ul className="divide-y divide-[#e5e5e5]">
        {vagas.map((vaga) => (
          <li key={vaga.id} className="flex items-center gap-4 py-[14px]">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h3 className="text-[18px] font-semibold text-[#2d2d2d]">
                {vaga.titulo}
              </h3>
              <p className="text-sm text-[#595959]">{vaga.local}</p>
            </div>

            <span
              className={`shrink-0 rounded-[8px] px-2.5 py-1.5 text-[13px] font-semibold whitespace-nowrap ${
                vaga.compatibilidade >= 80
                  ? "bg-[#e6f4ea] text-[#1e7b34]"
                  : "bg-[#f1f3f7] text-[#454545]"
              }`}
            >
              {vaga.compatibilidade}% compatível
            </span>

            <button
              type="button"
              aria-label={`Salvar vaga: ${vaga.titulo}`}
              className="shrink-0 cursor-pointer text-[#2d2d2d] transition hover:text-[#0f1b3d]"
            >
              <Bookmark className="size-6" strokeWidth={2} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

