"use server"


import { createClient } from "@/lib/supabase/server"

const limite = 5 * 1024 * 1024 // 5MB de docs rs

type Resultado = {
    error?: string;
    id?: number
}

const enviarCurriculo = async (formData: FormData): Promise<Resultado> => {
    const arquivo = formData.get("arquivo")
    const cargo = String(formData.get("cargo") ?? "").trim()
    const empresa = String(formData.get("empresa") ?? "").trim()

    //validar campos no server: o que vem do cliente pode ser manipulado, então não dá pra confiar

    if (!(arquivo instanceof File) || arquivo.size === 0)
         return { error: "Selecione um arquivo para enviar." }
    if (arquivo.type !== "application/pdf")
        return { error: "O arquivo precisa ser um PDF." }
    if (arquivo.size > limite)
        return { error: "O arquivo é muito grande, o limite é 5MB." }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Sua sessão expirou. Entre novamente." }

    // a pasta coloquei no supas que tem que ter o id do suaruio se nao o pilicies recusa

    const caminho = `${user.id}/${crypto.randomUUID()}.pdf`

    const { error: erroUpload } = await supabase.storage
    .from("curriculos")
    .upload(caminho, arquivo, { contentType: "application/pdf" })
    if (erroUpload) 
        return { error: "Não conseguimos enviar o arquivo, tente novamente mais tarde." }

    const { data: curriculo, error: erroCurriculo } = await supabase
    .from("curriculo")
    .insert({
        idperfil: user.id,
        nome_arquivo: arquivo.name,
        storage_url: caminho,
        formato: "pdf",
        tamanho_bytes: arquivo.size,
    })
    .select("id")
    .single()

    if (erroCurriculo) {
        //se o banco falhar, apaga o arquivo do storage pra nao ficar lixo
        await supabase.storage
        .from("curriculos")
        .remove([caminho])
        return { error: "Não conseguimos salvar seu curriculo. Tente de novo"}
    }

    const { data: analise, error: erroAnalise } = await supabase
    .from("analise_curriculo")
    .insert({
        idcurriculo: curriculo.id,
        cargo_alvo: cargo || null,
        empresa_alvo: empresa || null,
        // status, pontos_fortes e pontos_melhoria usam o default do banco
    })
    .select("id")
    .single()

    if (erroAnalise)
        return { error: "Não conseguimos criar a análise do seu curriculo. Tente de novo" }

    return { id: analise.id }
}

export default enviarCurriculo