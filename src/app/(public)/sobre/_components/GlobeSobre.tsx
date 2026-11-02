"use client";

import { useEffect, useRef } from "react";

type Vec3 = [number, number, number];

const COR = "23, 37, 84"; // blue-950
const COR_ESCURO = "147, 197, 253"; // blue-300
const TOTAL_PONTOS = 1400;
const INCLINACAO = 0.35;
const VELOCIDADE = 0.0025;

// [lat, lon] em graus
const CIDADES: Record<string, [number, number]> = {
    saoPaulo: [-23.55, -46.63],
    rio: [-22.91, -43.17],
    recife: [-8.05, -34.88],
    manaus: [-3.12, -60.02],
    portoAlegre: [-30.03, -51.23],
    lisboa: [38.72, -9.14],
    novaYork: [40.71, -74.0],
    londres: [51.5, -0.12],
    buenosAires: [-34.6, -58.38],
    cidadeDoMexico: [19.43, -99.13],
};

const ARCOS: [string, string][] = [
    ["saoPaulo", "lisboa"],
    ["rio", "novaYork"],
    ["recife", "londres"],
    ["manaus", "cidadeDoMexico"],
    ["portoAlegre", "buenosAires"],
    ["saoPaulo", "recife"],
    ["buenosAires", "lisboa"],
];

function paraVetor([lat, lon]: [number, number]): Vec3 {
    const la = (lat * Math.PI) / 180;
    const lo = (lon * Math.PI) / 180;
    return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
}

function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
    const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
    const omega = Math.acos(dot);
    if (omega < 1e-6) return a;
    const s = Math.sin(omega);
    const ka = Math.sin((1 - t) * omega) / s;
    const kb = Math.sin(t * omega) / s;
    return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb];
}

function pontosFibonacci(n: number): Vec3[] {
    const pontos: Vec3[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = phi * i;
        pontos.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
    }
    return pontos;
}

export default function GlobeSobre() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const pontos = pontosFibonacci(TOTAL_PONTOS);
        const arcos = ARCOS.map(([de, para], i) => {
            const a = paraVetor(CIDADES[de]);
            const b = paraVetor(CIDADES[para]);
            const angulo = Math.acos(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
            const altura = 0.08 + 0.3 * (angulo / Math.PI);
            const amostras: Vec3[] = [];
            for (let s = 0; s <= 60; s++) {
                const t = s / 60;
                const p = slerp(a, b, t);
                const k = 1 + altura * Math.sin(Math.PI * t);
                amostras.push([p[0] * k, p[1] * k, p[2] * k]);
            }
            return { amostras, inicio: i * 0.45 };
        });
        const marcadores = Object.values(CIDADES).map(paraVetor);

        const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let largura = 0;
        let altura = 0;
        let rotacao = 0.9; // começa com a América do Sul de frente
        let frame = 0;
        let tempo = 0;

        const redimensionar = () => {
            const dpr = window.devicePixelRatio || 1;
            largura = canvas.clientWidth;
            altura = canvas.clientHeight;
            canvas.width = largura * dpr;
            canvas.height = altura * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const desenhar = () => {
            const cor = document.documentElement.classList.contains("dark") ? COR_ESCURO : COR;
            const raio = Math.min(largura, altura) * 0.42;
            const cx = largura / 2;
            const cy = altura / 2;
            const cosR = Math.cos(rotacao);
            const sinR = Math.sin(rotacao);
            const cosI = Math.cos(INCLINACAO);
            const sinI = Math.sin(INCLINACAO);

            const projetar = ([x, y, z]: Vec3) => {
                const x1 = x * cosR + z * sinR;
                const z1 = -x * sinR + z * cosR;
                const y2 = y * cosI - z1 * sinI;
                const z2 = y * sinI + z1 * cosI;
                return { x: cx + x1 * raio, y: cy - y2 * raio, z: z2, fora: x1 * x1 + y2 * y2 > 1 };
            };

            ctx.clearRect(0, 0, largura, altura);

            for (const p of pontos) {
                const { x, y, z } = projetar(p);
                if (z <= 0) continue;
                ctx.fillStyle = `rgba(${cor}, ${0.12 + z * 0.4})`;
                ctx.beginPath();
                ctx.arc(x, y, 0.6 + z * 0.9, 0, Math.PI * 2);
                ctx.fill();
            }

            for (const m of marcadores) {
                const { x, y, z } = projetar(m);
                if (z <= 0) continue;
                ctx.fillStyle = `rgba(${cor}, 0.9)`;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.lineWidth = 1.6;
            ctx.lineCap = "round";
            for (const arco of arcos) {
                // ciclo: desenha (0→1), recolhe (1→2), pausa (2→3)
                const ciclo = reduzirMovimento ? 1 : ((tempo - arco.inicio) % 3 + 3) % 3;
                const cabeca = Math.min(1, ciclo);
                const cauda = Math.max(0, Math.min(1, ciclo - 1));
                if (cabeca <= cauda) continue;

                const n = arco.amostras.length - 1;
                const i0 = Math.floor(cauda * n);
                const i1 = Math.ceil(cabeca * n);
                let desenhando = false;
                ctx.strokeStyle = `rgba(${cor}, 0.85)`;
                ctx.beginPath();
                for (let i = i0; i <= i1; i++) {
                    const p = projetar(arco.amostras[i]);
                    if (p.z > 0 || p.fora) {
                        if (desenhando) ctx.lineTo(p.x, p.y);
                        else ctx.moveTo(p.x, p.y);
                        desenhando = true;
                    } else {
                        desenhando = false;
                    }
                }
                ctx.stroke();
            }
        };

        const animar = () => {
            rotacao += VELOCIDADE;
            tempo += 1 / 60;
            desenhar();
            frame = requestAnimationFrame(animar);
        };

        const observer = new ResizeObserver(() => {
            redimensionar();
            desenhar();
        });
        observer.observe(canvas);
        redimensionar();

        if (reduzirMovimento) desenhar();
        else frame = requestAnimationFrame(animar);

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
        };
    }, []);

    return (
        <section className="flex justify-center bg-background px-4 pb-20 md:px-[120px]">
            <canvas
                ref={canvasRef}
                aria-label="Globo pontilhado conectando o Brasil ao mundo"
                role="img"
                className="aspect-square w-full max-w-[560px]"
            />
        </section>
    );
}