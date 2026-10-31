import Oferecemos from "./_components/offerMain";
import { ScrollSequence } from "./_components/scroll-sequence";
import Recursos from "./_components/recurse"
import Dados from "./_components/dados"

const frames = Array.from(
  { length: 150 },
  (_, i) => `/animations/projeto/frame_${String(i + 1).padStart(3, "0")}.jpg`,
);

export default function Home() {
  return (
    <main>
      <ScrollSequence frames={frames} scrollLength={5}>
        <div className="flex h-full flex-col items-start justify-center gap-4 text-start p-8 md:p-16 ">
          < h1 className="max-w-2xl text-6xl font-semibold text-white md:text-7xl ">
            Sua carreira não precisa avançar no escuro.
          </h1>
          <p className="text-white/85 max-w-2xl text-sm"> Descubra seus pontos fortes, entenda o que precisa desenvolver e
             transforme cada experiência em um passo rumo à oportunidade que você busca. </p>
        </div>
      </ScrollSequence>
      <Oferecemos/>
      <Recursos/>
      <Dados/>
    </main>
  );
}
