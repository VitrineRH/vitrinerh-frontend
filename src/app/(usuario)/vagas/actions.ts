"use server";

import { refresh } from "next/cache";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
type Resultado = { erro: string } | undefined;

async function buscarInteracao(idVaga: number) {
    const user = await getCurrentUser();
    const supabase = await createClient();

    const { data } = await supabase
        .from("vaga_interacao")
        .select("id, status")
        .eq("idperfil", user.id)
        .eq("idvagas", idVaga)
        .limit(1)
        .maybeSingle();

    return { user, supabase, interacao: data };
}

export async function alternarVagaSalva(idVaga: number): Promise<Resultado> {
    if (!Number.isInteger(idVaga)) return { erro: "Vaga inválida." };

    const { user, supabase, interacao } = await buscarInteracao(idVaga);

    if (interacao?.status === "candidatou") {
        return { erro: "Você já se candidatou a esta vaga." };
    }

    const { error } = interacao
        ? await supabase.from("vaga_interacao").delete().eq("id", interacao.id)
        : await supabase
            .from("vaga_interacao")
            .insert({ idperfil: user.id, idvagas: idVaga, status: "salva" });

    if (error) return { erro: "Não foi possível salvar a vaga. Tente novamente." };

    refresh();
}

export async function registrarCandidatura(idVaga: number): Promise<Resultado> {
    if (!Number.isInteger(idVaga)) return { erro: "Vaga inválida" };
    const { user, supabase, interacao } = await buscarInteracao(idVaga);

    if (interacao?.status === "candidatou") return;

    const { error } = interacao
        ? await supabase
            .from("vaga_interacao")
            .update({ status: "candidatou" })
            .eq("id", interacao.id)
        : await supabase
            .from("vaga_interacao")
            .insert({ idperfil: user.id, idvagas: idVaga, status: "candidatou" });

    if (error) return { erro: "Não foi possível registrar a candidatura." };

    refresh();

}

