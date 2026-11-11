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
      className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-[10px] bg-[#1a56db] px-5 text-sm font-semibold text-white transition hover:bg-[#1546b3] disabled:opacity-60"
    >
      {jaCandidatou ? "Abrir candidatura" : "Candidatar-se"}
      <ExternalLink className="size-4" aria-hidden />
    </button>
  );
} 