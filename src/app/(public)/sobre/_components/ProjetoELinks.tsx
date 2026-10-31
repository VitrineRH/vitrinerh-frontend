import Image from "next/image";

const REPOSITORIO_URL = "https://github.com/VitrineRH";

export default function ProjetoELinks() {
    return (
        <section className="bg-white px-4 py-20 md:px-[120px] md:py-[120px]">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-14">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="flex flex-col items-start gap-6 md:w-[620px]">
                        <span className="rounded-full border border-black/18 px-3.5 py-1.5 text-[13px] font-medium leading-[1.4] text-black">
                            Por trás do código
                        </span>
                        <h2 className="text-3xl font-medium leading-[1.12] tracking-[-1.2px]  text-black md:text-5xl">
                            Um projeto aberto, feito para ser conhecido.
                        </h2>
                    </div>
                    <p className="text-base leading-[1.6] text-[#525252] md:w-[460px] md:text-lg">
                        Acompanhe como o VitrineRH foi construído: código, documentação e as pessoas que estão por trás de cada decisão.
                    </p>
                </div>
                <div className="flex w-full flex-col gap-10 rounded-[20px] bg-black p-8 md:w-[475px]">
                    <div className="flex items-center justify-between">
                        <div className="flex size-12 items-center justify-center rounded-xl border border-white/16 bg-white/10">
                            <Image src="/icons/github.svg" alt="" width={22} height={22} />
                        </div>
                        <span className="text-[13px] leading-[1.4] text-white/55">
                            github.com/VitrineRH
                        </span>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <h3 className="text-[28px] font-medium leading-[1.2] tracking-[-0.42px] text-white">
                            Repositório do projeto
                        </h3>
                        <p className="leading-[1.6] text-white/65">
                            Todo o código do VitrineRH em um só lugar: front-end, back-end, histórico de versões e como contribuir.
                        </p>
                    </div>

                    <a
                        href={REPOSITORIO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-[13px] text-[15px] font-medium leading-[1.33] text-black transition-opacity hover:opacity-80"
                    >
                        Ver no GitHub
                        <Image src="/icons/seta.svg" alt="" width={16} height={16} />
                    </a>
                </div>
            </div>
        </section>
    );
}
