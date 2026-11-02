"use client";

import { useEffect, useRef } from "react";

type Brilho = {
    x: number;
    y: number;
    velocidadeX: number;
    velocidadeY: number;
    tamanho: number;
    ritmo: number;
    fase: number;
};

const QUANTIDADE_DE_BRILHOS = 80;

export default function Stardust() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
/* Inicio do efeito */
    useEffect(() => {
        const canvas = canvasRef.current;
        const card = canvas?.parentElement;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !card || !ctx) return;

        const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduzirMovimento) return;

        let animacao = 0;
        let ultimoTempo = 0;
/*tamanho do efeito*/ 
        const ajustarTamanho = () => {
            const escala = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = card.clientWidth * escala;
            canvas.height = card.clientHeight * escala;
            ctx.setTransform(escala, 0, 0, escala, 0, 0);
        };

        ajustarTamanho();

/*Criação dos brilhos */
        const brilhos: Brilho[] = Array.from({ length: QUANTIDADE_DE_BRILHOS }, () => ({
            x: Math.random() * card.clientWidth,
            y: Math.random() * card.clientHeight,
            velocidadeX: 4 + Math.random() * 10,
            velocidadeY: (Math.random() - 0.5) * 6,
            tamanho: 1.5 + Math.random() * 3,
            ritmo: 1 + Math.random() * 3,
            fase: Math.random() * Math.PI * 2,
        }));
/*Desenho de cada quadro*/
        const desenhar = (agora: number) => {
            const tempo = ultimoTempo ? Math.min((agora - ultimoTempo) / 1000, 0.05) : 0.016;
            ultimoTempo = agora;

            const largura = card.clientWidth;
            const altura = card.clientHeight;

            ctx.clearRect(0, 0, largura, altura);
            ctx.fillStyle = "#ffffff";

            for (const brilho of brilhos) {
                brilho.x += brilho.velocidadeX * tempo;
                brilho.y += brilho.velocidadeY * tempo;

                if (brilho.x > largura) brilho.x = 0;
                if (brilho.y > altura) brilho.y = 0;
                if (brilho.y < 0) brilho.y = altura;

                const onda = Math.sin((agora / 1000) * brilho.ritmo + brilho.fase);
                const flash = Math.pow(Math.max(onda, 0), 4);
                const tamanho = brilho.tamanho * (0.5 + flash * 0.5);

                ctx.globalAlpha = flash;
                ctx.fillRect(brilho.x - tamanho, brilho.y - 0.4, tamanho * 2, 0.8);
                ctx.fillRect(brilho.x - 0.4, brilho.y - tamanho, 0.8, tamanho * 2);
            }

            animacao = requestAnimationFrame(desenhar);
        };
/*Quando ela irá ou não aparecer na tela*/
        const observadorDeTela = new IntersectionObserver(([entrada]) => {
            if (entrada.isIntersecting) {
                if (!animacao) animacao = requestAnimationFrame(desenhar);
            } else {
                cancelAnimationFrame(animacao);
                animacao = 0;
                ultimoTempo = 0;
            }
        });

        const observador = new ResizeObserver(ajustarTamanho);
        observador.observe(card);
        observadorDeTela.observe(card);

        return () => {
            cancelAnimationFrame(animacao);
            observador.disconnect();
            observadorDeTela.disconnect();
        };
    }, []);
/*O que aparece na tela*/
    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
        />
    );
}