"use client";

import { useState, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { alternarVagaSalva } from "../actions";

type Props = {
  idVaga: number;
  salva: boolean;
  desabilitado: boolean;
};

export default function BotaoSalvar({ idVaga, salva, desabilitado }: Props) {
  const [pendente, iniciarTransicao] = useTransition();
  const [erro, setErro] = useState("");

  function salvar() {
    setErro("");
    iniciarTransicao(async () => {
      const resultado = await alternarVagaSalva(idVaga);
      if (resultado?.erro) setErro(resultado.erro);
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={salvar}
        disabled={pendente || desabilitado}
        aria-pressed={salva}
        className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-[10px] border border-[#d9d9d9] bg-white px-5 text-sm font-semibold text-[#2d2d2d] transition hover:border-[#1a56db] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Bookmark
          className={`size-5 ${salva ? "fill-[#1a56db] text-[#1a56db]" : ""}`}
          strokeWidth={2}
        />
        {pendente ? "Salvando..." : salva ? "Vaga salva" : "Salvar vaga"}
      </button>
      {erro && <p role="alert" className="text-xs text-red-600">{erro}</p>}
    </div>
  );
}

