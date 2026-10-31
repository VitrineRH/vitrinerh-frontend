import Image from "next/image";

export default function ComoComecou() {
    return (
        <section className="bg-[#f5f5f5] px-4 py-20 md:px-[120px] md:py-[120px]">
            <div className="mx-auto grid max-w-[1200px] items-center gap-10 md:grid-cols-2 md:gap-20">
                <div className="relative aspect-[560/680] w-full overflow-hidden rounded-[20px]">
                    <Image
                        src="/images/reuniao-mesa.png"
                        alt="Pessoas reunidas em uma mesa de trabalho apertando as mãos"
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col gap-6">
                    <h2 className="text-3xl font-medium leading-[1.12] tracking-[-1.1px] text-black md:text-[44px]" >
                        Uma visão melhor sobre o mercado de trabalho
                    </h2>
                    <div className="flex flex-col gap-2 leading-[1.64] text-[#525252] md:text-lg md:text-justify">
                        <p>
                            Criado em setembro de 2026, a partir de um projeto do Instituto
                            PROA, o VitrineRH nasceu da iniciativa de oito integrantes com um
                            propósito em comum,
                            <strong> tornar a preparação profissional mais acessível e direcionada.</strong>
                        </p             >
                        <p>
                        Muitos candidatos desconhecem os requisitos das vagas, não recebem feedbacks que orientem seu desenvolvimento ou encontram dificuldades para identificar as competências que precisam aprimorar.
                        </p>
                        <p>
                            Essa falta de direcionamento pode afastá-los de seus objetivos profissionais.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}