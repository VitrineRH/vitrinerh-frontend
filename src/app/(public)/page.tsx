import Oferecemos from "./_components/offerMain";
import { ScrollSequence } from "./_components/scroll-sequence";
import Recursos from "./_components/recurse"

const frames = Array.from(
  { length: 150 },
  (_, i) => `/animations/projeto/frame_${String(i + 1).padStart(3, "0")}.jpg`,
);

export default function Home() {
  return (
    <main>
      <ScrollSequence frames={frames} scrollLength={5}>
        <div className="flex h-full items-end p-8 md:p-16">
          < h1 className="max-w-2xl text-4xl font-semibold text-white md:text-6xl ">
            VitrineRH
          </h1>
        </div>
      </ScrollSequence>
      <Oferecemos/>
      <Recursos/>
    </main>
  );
}
