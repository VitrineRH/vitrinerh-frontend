import DotGrid from "@/components/DotGrid"

const noiseSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'>
  <filter id='n'>
    <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
    <feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  12 0 0 0 -7.6'/>
  </filter>
  <rect width='100%' height='100%' filter='url(#n)'/>
</svg>`

const noiseUrl = `url("data:image/svg+xml,${encodeURIComponent(noiseSvg)}")`

// style={{ width: '100%', height: '600px', position: 'relative' }}
const Dados = () => {
    return (
        <section className="bg-black relative min-h-[600px] overflow-hidden">


            <div className="absolute inset-0 z-0">
                <DotGrid
                    baseColor="#000000"
                    activeColor="#ffffff"
                    shape="circle"
                    dotSize={5}
                    gap={18}
                    proximity={140}
                    strength={1}
                    bounce={0.6}
                    tension={0.4}
                    returnDuration={0.8}
                    shockRadius={320}
                    shockStrength={5}
                    swell={0.8}
                    stretch={0.5}
                    glow={0.5}
                    fade={0}
                    intro
                    opacity={1}
                    mouseInteraction
                    clickShock
                // background rs
                />
            </div>

            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-5 opacity-17"
                style={{ backgroundImage: noiseUrl }}
            />

            <div className="relative z-10  min-h-[600px] text-white px-14 py-16 grid grid-cols-2">
                <div className="flex flex-col gap-20 my-auto">
                    <h3 className="text-5xl font-medium max-w-xl">
                        Falta retorno de um lado.
                    </h3>
                    <h3 className="text-5xl font-medium max-w-2xl">
                        Sobra vontade de aprender do outro.
                    </h3>
                    <p className="text-sm text-white/75 ">
                        Foi por pra suprir isso que o Vitrine<span className="font-bold">RH</span> nasceu.
                    </p>
                </div>
                <div className="flex flex-col gap-12 my-10">
                    <div className="grid grid-cols-[0.1fr_2fr] gap-4">
                        <h4 className="text-9xl"> 41% </h4>
                        <div className="flex flex-col gap-4">
                            <p className="text-2xl">dos candidatos receberam algum retorno depois de um processo seletivo.</p>
                            <p className="text-sm text-white/85">Fonte: Global Talent Trends, 2024</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-[0.1fr_2fr] gap-2">
                        <h4 className="text-9xl"> 69% </h4>
                        <div className="flex flex-col gap-4">
                            <p className="text-2xl">dos trabalhadores brasileiros planejam fazer cursos rápidos e certificações para manter o currículo competitivo.</p>
                            <p className="text-sm text-white/85">Fonte: Levantamento EDC Group</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Dados