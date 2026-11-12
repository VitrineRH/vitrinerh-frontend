export default function SeloCompatibilidade({ valor }: { valor: number }) {
  return (
    <span
      className={`shrink-0 rounded-[8px] px-2.5 py-1.5 text-[13px] font-semibold whitespace-nowrap ${valor >= 80 ? "bg-[#e6f4ea] text-[#1e7b34]" : "bg-[#f1f3f7] text-[#454545]"
        }`}
    >
      {valor}% compatível
    </span>
  );
}