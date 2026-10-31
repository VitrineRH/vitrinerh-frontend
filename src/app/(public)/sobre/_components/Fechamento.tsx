import Image from "next/image";

export default function Fechamento() {
    return (
        <section className="relative overflow-hidden bg-black px-4 py-20 md:px-[120px] md:py-[128px]">
            <Image
                src="/images/brilho-fechamento.svg"
                alt=""
                width={1300}
                height={820}
                className="pointer-events-none absolute left-1/2 top-[-40px] max-w-none -translate-x-1/2"
            />
            <div className="relative mx-auto flex max-w-[1000px] flex-col items-center gap-8 text-center">
                <p className="text-3xl font-medium leading-[1.14] tracking-[-1.2px] text-white md:text-5xl">
                    Acreditamos que toda pessoa merece clareza para reconhecer seu potencial, desenvolver suas habilidades e traçar os próximos passos para sua carreira.
                </p>
                <p className="max-w-[640px] text-base leading-[1.6] text-white/65 md:text-[19px]">
                    VitrineRH. Sua próxima oportunidade começa com o que você aprende hoje!
                </p>
            </div>
        </section>
    );
}