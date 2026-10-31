"use client";

import { useEffect } from "react";

const SUAVIDADE = 0.08;

function temRolagemPropria(alvoDoEvento: EventTarget | null) {
    let elemento = alvoDoEvento instanceof Element ? alvoDoEvento : null;

    while (elemento && elemento !== document.body) {
        const { overflowY } = getComputedStyle(elemento);
        const rolavel = overflowY === "auto" || overflowY === "scroll";

        if (rolavel && elemento.scrollHeight > elemento.clientHeight) return true;

        elemento = elemento.parentElement;
    }

    return false;
}

export default function RolagemSuave() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let destino = window.scrollY;
        let posicao = window.scrollY;
        let animando = false;
        let quadro = 0;

        const limite = () => document.documentElement.scrollHeight - window.innerHeight;

        const animar = () => {
            posicao += (destino - posicao) * SUAVIDADE;

            if (Math.abs(destino - posicao) < 0.5) {
                posicao = destino;
                animando = false;
            }

            window.scrollTo({ top: posicao, behavior: "instant" });

            if (animando) quadro = requestAnimationFrame(animar);
        };

        const aoGirarRodinha = (evento: WheelEvent) => {
            if (evento.ctrlKey || temRolagemPropria(evento.target)) return;

            evento.preventDefault();

            if (!animando) {
                posicao = window.scrollY;
                destino = posicao;
            }

            const multiplicador = evento.deltaMode === 1 ? 40 : evento.deltaMode === 2 ? window.innerHeight : 1;
            destino = Math.max(0, Math.min(destino + evento.deltaY * multiplicador, limite()));

            if (!animando) {
                animando = true;
                quadro = requestAnimationFrame(animar);
            }
        };

        const aoRolar = () => {
            if (!animando) {
                posicao = window.scrollY;
                destino = posicao;
            }
        };

        window.addEventListener("wheel", aoGirarRodinha, { passive: false });
        window.addEventListener("scroll", aoRolar, { passive: true });

        return () => {
            window.removeEventListener("wheel", aoGirarRodinha);
            window.removeEventListener("scroll", aoRolar);
            cancelAnimationFrame(quadro);
        };
    }, []);

    return null;
}
