import Link from "next/link";
import type { CardAcaoDados } from "../homeMock";

export default function CardAcao({
  titulo,
  descricao,
  textoBotao,
  link,
}: CardAcaoDados) {
  return (
    <section className="flex flex-col gap-3 rounded-[16px] border border-[#d9d9d9] bg-white px-6 pt-5 pb-6 shadow-[0px_2px_6px_rgba(0,0,0,0.06)] dark:border-border dark:bg-card">
      <h2 className="text-base font-semibold text-black dark:text-foreground">{titulo}</h2>

      <p className="text-sm leading-5 text-[#595959] dark:text-muted-foreground">{descricao}</p>

      <Link
        href={link}
        className="self-start rounded-[10px] border border-[#0f1b3d] bg-white px-[18px] py-3 text-[15px] leading-5 font-semibold text-[#0f1b3d] transition hover:bg-gray-200/90 hover:shadow-[0_4px_12px_-2px_rgba(15,27,61,0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f1b3d] dark:border-blue-300/50 dark:bg-transparent dark:text-blue-200 dark:hover:bg-blue-500/10 dark:focus-visible:outline-blue-300"
      >
        {textoBotao}
      </Link>
    </section>
  );
}
