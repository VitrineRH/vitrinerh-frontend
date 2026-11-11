type LinhaVagaSkeletonProps = {
  opacidade: number;
  larguraTitulo: number;
  larguraTexto: number;
};

export default function LinhaVagaSkeleton({
  opacidade,
  larguraTitulo,
  larguraTexto,
}: LinhaVagaSkeletonProps) {
  return (
    <div
      className="flex items-center gap-4 py-[14px]"
      style={{ opacity: opacidade }}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div
          className="h-[14px] max-w-full rounded-[4px] bg-[#e2e6ee] dark:bg-muted"
          style={{ width: larguraTitulo }}
        />
        <div
          className="h-2.5 max-w-full rounded-[4px] bg-[#eef1f5] dark:bg-muted/60"
          style={{ width: larguraTexto }}
        />
      </div>

      <span className="shrink-0 rounded-[8px] bg-[#f1f3f7] px-2.5 py-1.5 text-[13px] font-semibold whitespace-nowrap text-[#94a3b8] dark:bg-muted dark:text-muted-foreground">
       compatível
      </span>
    </div>
  );
}
