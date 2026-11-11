import { createClient } from "@/lib/supabase/server"

const getLimiteAnalises = async (): Promise<number | null> => {
    const supabase = await createClient()

    const { data: assinatura } = await supabase
    .from("assinatura")
    .select("planos ( limite_analise )")
    .eq("status", "ativa")
    .maybeSingle()

    if (assinatura?.planos) return assinatura.planos.limite_analise
    
    return 5
}

export default getLimiteAnalises