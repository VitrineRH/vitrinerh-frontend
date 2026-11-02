export default function TituloSobre() {
    return (
        <section className="flex flex-col items-center gap-7 bg-background px-4 pt-[120px] pb-20 text-center md:px-[120px]">
            <h1 className="text-5xl font-medium leading-[1.08] tracking-[-1.6px] text-foreground md:text-[64px]">Nossa história</h1>
            <div className="max-w-[760px] text-lg leading-[1.6] text-muted-foreground md:text-xl">
                <p>
                    Conquistar uma oportunidade exige mais do que encontrar uma vaga.
                </p>
                <p>
                    Exige preparo, orientação e clareza sobre como chegar até ela.
                </p>
            </div>
        </section>
    );
}