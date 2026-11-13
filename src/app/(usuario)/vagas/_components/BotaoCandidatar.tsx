"use client";

import { useTransition } from "react";
import { ExternalLink } from "lucide-react";
import { registrarCandidatura } from "../actions";

type Props = {
  idVaga: number;
  url: string | null;
  jaCandidatou: boolean;
};

export default function BotaoCandidatar({ idVaga, url, jaCandidatou }: Props) {
  const [pendente, iniciarTransicao] = useTransition();

  if (!url) {
    return (
      <span className="inline-flex h-11 items-center rounded-[10px] bg-[#f1f3f7] px-5 text-sm font-semibold text-[#595959]">
        Candidatura indisponível
      </span>
    );
  }

  const link = url;

  function candidatar() {
    window.open(link, "_blank", "noopener,noreferrer");
    iniciarTransicao(async () => {
      await registrarCandidatura(idVaga);
    });
  }

  return (
    <button
      type="button"
      onClick={candidatar}
      disabled={pendente}
      className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-[10px] bg-gradient-to-r from-black to-blue-800/95 px-5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:brightness-125 active:scale-95 disabled:opacity-60"
    >
      {jaCandidatou ? "Abrir candidatura" : "Candidatar-se"}
      <ExternalLink className="size-4" aria-hidden />
    </button>
  );
} 