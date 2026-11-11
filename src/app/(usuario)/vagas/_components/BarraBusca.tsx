import Form from "next/form";
import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import type { Filtros } from "../_lib/tipos";
import { JORNADAS, MODALIDADES, REGIMES, rotulo } from "../_lib/utils";


const campo =
  "h-11 rounded-[10px] border border-[#d9d9d9] bg-white px-3 text-sm text-[#2d2d2d] outline-none focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20";

export default function BarraBusca({ filtros }: { filtros: Filtros }) {
  return (
    <Form
      action="/vagas"
      className="flex flex-col gap-4 rounded-[16px] border border-[#d9d9d9] bg-white p-4 shadow-[0px_2px_6px_rgba(0,0,0,0.06)]"
    >
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Cargo ou palavra-chave</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#595959]"
            aria-hidden
          />
          <input
            name="q"
            defaultValue={filtros.q}
            placeholder="Cargo ou palavra-chave"
            className={`${campo} w-full pl-9`}
          />
        </label>

        <label className="relative flex-1">
          <span className="sr-only">Cidade</span>
          <MapPin
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#595959]"
            aria-hidden
          />
          <input
            name="local"
            defaultValue={filtros.local}
            placeholder="Cidade"
            className={`${campo} w-full pl-9`}
          />
        </label>

        <button
          type="submit"
          className="h-11 cursor-pointer rounded-[10px] bg-[#1a56db] px-6 text-sm font-semibold text-white transition hover:bg-[#1546b3]"
        >
          Buscar vagas
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <Seletor nome="modalidade" titulo="Modalidade" opcoes={MODALIDADES} valor={filtros.modalidade} />
        <Seletor nome="regime" titulo="Contrato" opcoes={REGIMES} valor={filtros.regime} />
        <Seletor nome="jornada" titulo="Jornada" opcoes={JORNADAS} valor={filtros.jornada} />
        <Link href="/vagas" className="pb-3 text-sm font-medium text-[#1a56db] hover:underline">
          Limpar filtros
        </Link>
      </div>
    </Form>
  );
}

type SeletorProps = {
  nome: string;
  titulo: string;
  opcoes: string[];
  valor: string;
};

function Seletor({ nome, titulo, opcoes, valor }: SeletorProps) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-[#595959]">
      {titulo}
      <select name={nome} defaultValue={valor} className={campo}>
        <option value="">Todos</option>
        {opcoes.map((opcao) => (
          <option key={opcao} value={opcao}>
            {rotulo(opcao)}
          </option>
        ))}
      </select>
    </label>
  );
}
