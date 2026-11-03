import type { Etapa } from "../homeMock";
import EtapaItem from "./EtapaItem";

type PrimeirosPassosProps = {
  etapas: Etapa[];
};

export default function PrimeirosPassos({ etapas }: PrimeirosPassosProps) {
  return (
    <section className="flex flex-col gap-2.5 rounded-[16px] border border-[#d9d9d9] bg-white px-6 pt-5 pb-6 shadow-[0px_2px_6px_rgba(0,0,0,0.06)]">
      <h2 className="text-base font-semibold text-black">Primeiros passos</h2>

      <ol className="flex flex-col divide-y divide-[#e5e5e5]">
        {etapas.map((etapa) => (
          <EtapaItem key={etapa.numero} etapa={etapa} />
        ))}
      </ol>
    </section>
  );
}
