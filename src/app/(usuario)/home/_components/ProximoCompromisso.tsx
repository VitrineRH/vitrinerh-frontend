import Link from "next/link";

export default function ProximoCompromisso() {
  return (
    <section className="flex flex-col gap-[14px] rounded-[16px] border border-[#d9d9d9] bg-white px-6 pt-5 pb-6 shadow-[0px_2px_6px_rgba(0,0,0,0.06)]">
      <h2 className="text-base font-semibold text-black">
        Próximo compromisso
      </h2>

      <div className="flex items-center gap-4">
        <div className="flex shrink-0 flex-col items-center rounded-[12px] bg-[#f1f3f7] px-[14px] py-2">
          <span className="text-xs font-semibold text-[#64748b]">QUI</span>
          <span className="text-[22px] font-semibold text-[#0f1b3d]">29</span>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-[18px] font-semibold text-[#2d2d2d]">
            Análise com o RH
          </h3>
          <p className="text-sm text-[#595959]">
            29 de outubro, 14h00 às 14h30
          </p>
          <p className="text-sm text-[#595959]">
            Com Mariana Costa, Mentora de RH
          </p>
        </div>
      </div>

      <div className="h-px" />

      <div className="flex flex-wrap gap-[10px]">
        <button
          type="button"
           className="cursor-pointer rounded-[10px] bg-[#0f1b3d] px-[18px] py-3 text-[15px] leading-5 font-semibold text-white transition hover:bg-[#0f1b3d]/90 hover:shadow-[0_4px_12px_-2px_rgba(15,27,61,0.18)]"
        >
          Entrar na chamada
        </button>
        <Link
          href="/agenda"
          className="rounded-[10px] border border-[#0f1b3d] bg-white px-[18px] py-3 text-[15px] leading-5 font-semibold text-[#0f1b3d]  transition hover:bg-gray-200/90 hover:shadow-[0_4px_12px_-2px_rgba(15,27,61,0.18)]"
        >
          Ver agenda
        </Link>

      </div>
    </section>
  );
}
