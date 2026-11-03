import type { Etapa } from "../homeMock";

type EtapaItemProps = {
  etapa: Etapa;
};

export default function EtapaItem({ etapa }: EtapaItemProps) {
  const ativa = etapa.status === "ativa";

  return (
    <li
      aria-current={ativa ? "step" : undefined}
      className="flex items-center gap-[14px] py-2"
    >
      <span
        className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${
          ativa ? "bg-[#0f1b3d] text-white" : "bg-[#f1f3f7] text-[#64748b]"
        }`}
      >
        {etapa.numero}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <h3
          className={`text-[15px] leading-[19px] font-semibold ${
            ativa ? "text-[#0f1b3d]" : "text-[#2d2d2d]"
          }`}
        >
          {etapa.titulo}
        </h3>
        <p className="text-[13px] leading-[17px] text-[#595959]">
          {etapa.subtitulo}
        </p>
      </div>

      {ativa && (
        <span className="shrink-0 rounded-[8px] bg-[#e6f4ea] px-2 py-1 text-xs font-semibold text-[#1e7b34]">
          Agora
        </span>
      )}
    </li>
  );
}
