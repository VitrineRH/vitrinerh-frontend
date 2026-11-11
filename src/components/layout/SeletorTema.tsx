"use client";

import { useId, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { motion, useReducedMotion } from "motion/react";
import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const opcoes: { valor: string; rotulo: string; icone: LucideIcon }[] = [
  { valor: "light", rotulo: "Claro", icone: Sun },
  { valor: "dark", rotulo: "Escuro", icone: Moon },
  { valor: "system", rotulo: "Auto", icone: Monitor },
];

// O tema só é conhecido no navegador; no servidor renderizamos um esqueleto.
const semInscricao = () => () => {};
function useMontado() {
  return useSyncExternalStore(semInscricao, () => true, () => false);
}

export function SeletorTema({ recolhido }: { recolhido: boolean }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const montado = useMontado();
  const reduzirMovimento = useReducedMotion();
  const id = useId();

  // Sidebar recolhida: um único botão que alterna entre claro e escuro.
  if (recolhido) {
    const escuro = montado && resolvedTheme === "dark";
    const Icone = escuro ? Sun : Moon;
    const rotulo = escuro ? "Usar modo claro" : "Usar modo escuro";

    return (
      <SidebarMenuButton
        tooltip={rotulo}
        aria-label={rotulo}
        onClick={() => setTheme(escuro ? "light" : "dark")}
        className="justify-center text-muted-foreground hover:text-foreground"
      >
        <Icone className="size-4" />
      </SidebarMenuButton>
    );
  }

  const atual = montado ? theme ?? "system" : undefined;

  return (
    <div
      role="radiogroup"
      aria-label="Tema da interface"
      className="grid grid-cols-3 gap-1 rounded-xl bg-sidebar-accent/70 p-1"
    >
      {opcoes.map(({ valor, rotulo, icone: Icone }) => {
        const ativo = atual === valor;

        return (
          <button
            key={valor}
            type="button"
            role="radio"
            aria-checked={ativo}
            onClick={() => setTheme(valor)}
            className={cn(
              "relative flex h-8 items-center justify-center gap-1.5 rounded-lg text-xs outline-none transition-colors hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-400",
              ativo
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {ativo && (
              <motion.span
                layoutId={id}
                className="absolute inset-0 rounded-lg bg-background shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                transition={
                  reduzirMovimento
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 420, damping: 34 }
                }
              />
            )}
            <span className="relative flex items-center gap-1.5">
              <Icone className="size-3.5" />
              {rotulo}
            </span>
          </button>
        );
      })}
    </div>
  );
}
