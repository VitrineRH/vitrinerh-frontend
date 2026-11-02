import GlowCursor from "@/components/GlowCursor";

export default function Fechamento() {
    return (
        <section className="relative overflow-hidden bg-black px-4 py-20 md:px-[120px] md:py-[128px]">
        
            <GlowCursor
                color="#5f8bff"
                intensity={1.3}
                trailWidth={3}
                linger={1.4}
                glow={1.2}
                clickBurst
                theme="light"
                style={{ position: "absolute", inset: 0 }}
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