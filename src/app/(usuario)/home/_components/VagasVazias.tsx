import Link from "next/link";
import LinhaVagaSkeleton from "./LinhaVagaSkeleton";

const linhas = [
  { opacidade: 0.9, larguraTitulo: 222.4, larguraTexto: 181.3 },
  { opacidade: 0.6, larguraTitulo: 233.6, larguraTexto: 165.9 },
  { opacidade: 0.35, larguraTitulo: 184, larguraTexto: 195.3 },
];

export default function VagasVazias() {
  return (
    <section className="flex flex-col gap-1 rounded-[16px] border border-[#d9d9d9] bg-white px-6 pt-5 pb-3 shadow-[0px_2px_6px_rgba(0,0,0,0.06)] dark:border-border dark:bg-card">
      <div className="flex items-center justify-between gap-4 pb-2">
        <h2 className="text-base font-semibold text-black dark:text-foreground">
          Vagas recomendadas para você
        </h2>
        <Link
          href="/vagas"
          className="shrink-0 rounded-sm text-sm font-medium text-[#1a56db] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a56db] dark:text-blue-400 dark:focus-visible:outline-blue-400"
        >
          Explorar todas as vagas
        </Link>
      </div>

      <div className="flex flex-col gap-1.5 pt-1.5 pb-2.5">
        <h3 className="text-[18px] font-semibold text-[#2d2d2d] dark:text-foreground">
          Sugestões de vagas que irão aparecer depois da análise
        </h3>
        <p className="text-sm text-[#595959] dark:text-muted-foreground">
          Comparamos seu currículo com as vagas abertas e mostramos primeiro as
          que têm mais chance de dar certo.
        </p>
      </div>

      <div
        aria-hidden="true"
        className="divide-y divide-[#e5e5e5] border-t border-[#e5e5e5] dark:divide-border dark:border-border"
      >
        {linhas.map((linha) => (
          <LinhaVagaSkeleton key={linha.opacidade} {...linha} />
        ))}
      </div>
    </section>
  );
}
