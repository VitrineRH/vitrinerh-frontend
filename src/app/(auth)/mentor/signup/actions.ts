"use server"

import { createClient } from '@/lib/supabase/server'

type Solicitacao = {
    nome: string;
    email: string;
    linkedin: string;
    area: string;
    cargo: string;
    tempo: string;
    ajuda: string;
    disponibilidade: string;
    termos: boolean;
}

const EnviarSolicitacao = async (dados: Solicitacao) => {
    if (!dados.termos) return { error: "Você precisa aceitar o código de conduta para enviar a solicitação." }

    const supabase = await createClient()
    const { error } = await supabase.from("solicitacao_mentor").insert({
        nome_completa: dados.nome.trim(),
        email: dados.email.trim().toLowerCase(),
        linkedin_url: dados.linkedin.trim(),
        area_atuacao: dados.area.trim(),
        cargo_empresa_atual: dados.cargo.trim(),
        tempo_experiencia: dados.tempo.trim(),
        como_ajudar: dados.ajuda.trim(),
        disponibilidade_mes: dados.disponibilidade.trim(),
        codigo_conduta: dados.termos,
    })

    if (error?.code === "23505")
        return { error: "Você já enviou uma solicitação, aguarde a resposta do nosso time." }
    if(error) 
        return { error: "Ocorreu um erro ao enviar a solicitação, tente novamente mais tarde." }
    return{};
}

export default EnviarSolicitacao