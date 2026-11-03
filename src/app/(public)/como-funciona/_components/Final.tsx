import GlowCursor from "@/components/GlowCursor"

const Final = () => {
    return (
        <section className="bg-black relative min-h-[600px] overflow-hidden">
            <div className="absolute inset-0 z-0">
                <GlowCursor
                    color="#5f8bff"
                    intensity={1.3}
                    trailWidth={3}
                    linger={1.4}
                    glow={1.2}
                    clickBurst
                    theme="light"
                >
                    <div className="relative z-10  min-h-[600px] text-white px-14 py-auto justify-center text-center flex flex-col gap-14">
                        <h4 className="text-7xl max-w-4xl mx-auto"> Comece agora com a sua primeira analise de currículo </h4>
                        <p className="text-lg max-w-4xl mx-auto text-white/70 "> Leva poucos minutos e mostra exatamente o que ajeitar para sua proxima candidatura </p>
                    </div>
                </GlowCursor>
            </div>
        </section>
    )
}

export default Final
