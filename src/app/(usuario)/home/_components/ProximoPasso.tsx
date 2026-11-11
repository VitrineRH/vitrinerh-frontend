import Link from "next/link";
import type { ProximoPassoDados } from "../homeMock";

export default function ProximoPasso({
  etiqueta,
  titulo,
  descricao,
  progresso,
  textoPrincipal,
  linkPrincipal,
  textoSecundario,
  linkSecundario,
}: ProximoPassoDados) {
  return (
    <section className="flex min-h-[300px] flex-col gap-5 rounded-[16px] bg-[#0f1b3d] px-8 py-7 shadow-[0px_2px_6px_rgba(0,0,0,0.06)] dark:bg-[#13265e] dark:ring-1 dark:ring-white/10">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-white/70">{etiqueta}</p>
        <h2 className="text-[28px] leading-9 font-semibold text-white">
          {titulo}
        </h2>
        <p className="text-[15px] leading-[22px] text-white/75">{descricao}</p>
      </div>

      <div
        role="progressbar"
        aria-label="Progresso do currículo"
        aria-valuenow={progresso}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full rounded-full bg-white/18"
      >
        <div
          className="h-2 rounded-full bg-white"
          style={{ width: `${progresso}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={linkPrincipal}
          className="rounded-[10px] bg-white px-[18px] py-3 text-[15px] leading-5 font-semibold text-[#0f1b3d] transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {textoPrincipal}
        </Link>
        <Link
          href={linkSecundario}
          className="rounded-[10px] border border-white/40 px-[18px] py-3 text-[15px] leading-5 font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {textoSecundario}
        </Link>
      </div>
    </section>
  );
}
