import Link from "next/link";
import { SearchX } from "lucide-react";

export default function SemVagas() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[16px] border border-dashed border-[#d9d9d9] bg-white px-6 py-14 text-center">
      <SearchX className="size-10 text-[#94a3b8]" aria-hidden />
      <h2 className="text-base font-semibold text-black">Nenhuma vaga encontrada</h2>
      <p className="max-w-sm text-sm text-[#64748b]">
        Tente outras palavras-chave ou remova alguns filtros.
      </p>
      <Link href="/vagas" className="text-sm font-medium text-[#1a56db] hover:underline">
        Ver todas as vagas
      </Link>
    </div>
  );
}