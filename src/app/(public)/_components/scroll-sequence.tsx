"use client";

import { useEffect, useRef, useState } from "react";

type ScrollSequenceProps = {
  frames: string[];
  scrollLength?: number;
  children?: React.ReactNode;
};

export function ScrollSequence({
  frames,
  scrollLength = 4,
  children,
}: ScrollSequenceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!section || !canvas || !ctx) return;

    const images: HTMLImageElement[] = frames.map((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      return img;
    });

    let current = -1;
    let raf = 0;
    let disposed = false;

    const draw = (index: number) => {
      let img = images[index];
      for (let i = 1; !img?.complete || !img.naturalWidth; i++) {
        img = images[index - i] ?? images[index + i];
        if (i > images.length) return;
      }

      const { width: cw, height: ch } = canvas;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      if (current >= 0) draw(current);
    };

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      setProgress(p);

      const index = Math.round(p * (frames.length - 1));
      if (index !== current) {
        current = index;
        draw(index);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    
    images[0].onload = () => {
      if (disposed) return;
      resize();
      update();
    };
    if (images[0].complete) {
      resize();
      update();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => {
      resize();
      onScroll();
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [frames]);

  return (
    <section
      ref={sectionRef}
      style={{ height: `${(scrollLength + 1) * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
        <div className="pointer-events-none absolute inset-0">{children}</div>
        <div className="absolute right-6 top-1/2 h-40 w-px -translate-y-1/2 bg-white/25">
          <div
            className="absolute left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
            style={{ top: `${progress * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}
