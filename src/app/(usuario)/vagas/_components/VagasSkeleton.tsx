import { Skeleton } from "@/components/ui/skeleton";

export default function VagasSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Carregando vagas">
      <Skeleton className="h-[132px] w-full rounded-[16px] bg-gray-200" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-[150px] w-full rounded-[16px] bg-gray-200"/>
          ))}
        </div>

        <Skeleton className="hidden h-[480px] w-full rounded-[16px] bg-gray-200 lg:block"/>
      </div>
    </div>
  );
}
