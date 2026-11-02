"use client";

import { useEffect } from "react";

// quanto menor, mais devagar a página desliza
const SUAVIDADE = 0.08;

// confere se o mouse está em cima de algo com rolagem própria, tipo um modal
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

    // destino: onde a página quer chegar / posicao: onde ela está agora
        let destino = window.scrollY;
        let posicao = window.scrollY;
        let animando = false;
        let quadro = 0;

        // o máximo que dá pra rolar
        const limite = () => document.documentElement.scrollHeight - window.innerHeight;

        const animar = () => {
            // anda um pedacinho do que falta a cada quadro
            posicao += (destino - posicao) * SUAVIDADE;

            // já chegou perto o bastante, pode parar
            if (Math.abs(destino - posicao) < 0.5) {
                posicao = destino;
                animando = false;
            }

            window.scrollTo({ top: posicao, behavior: "instant" });

            if (animando) quadro = requestAnimationFrame(animar);
        };

        const aoGirarRodinha = (evento: WheelEvent) => {
            // não mexe no zoom nem em área com rolagem própria
            if (evento.ctrlKey || temRolagemPropria(evento.target)) return;

            // cancela o pulo normal da rodinha
            evento.preventDefault();

            if (!animando) {
                posicao = window.scrollY;
                destino = posicao;
            }

            // a rodinha pode mandar o valor em pixels, linhas ou páginas
            const multiplicador = evento.deltaMode === 1 ? 40 : evento.deltaMode === 2 ? window.innerHeight : 1;
            // soma o giro sem passar do topo nem do fim da página
            destino = Math.max(0, Math.min(destino + evento.deltaY * multiplicador, limite()));

            if (!animando) {
                animando = true;
                quadro = requestAnimationFrame(animar);
            }
        };

        // se rolar pela barra ou pelo teclado, atualiza a posição
        const aoRolar = () => {
            if (!animando) {
                posicao = window.scrollY;
                destino = posicao;
            }
        };

        window.addEventListener("wheel", aoGirarRodinha, { passive: false });
        window.addEventListener("scroll", aoRolar, { passive: true });

        // limpa tudo quando sai da página
        return () => {
            window.removeEventListener("wheel", aoGirarRodinha);
            window.removeEventListener("scroll", aoRolar);
            cancelAnimationFrame(quadro);
        };
    }, []);

    // não desenha nada, só controla a rolagem
    return null;
}
