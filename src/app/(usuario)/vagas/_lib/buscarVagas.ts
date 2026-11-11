import { createClient } from "@/lib/supabase/server";
import type { Filtros, StatusInteracao, Vaga, VagaComDados } from "./tipos";

const COLUNAS =
  "id, titulo, descricao, requisitos, beneficios, cidade, uf, regime, modalidade, jornada, salario_min, salario_max, publicada_em, url_candidatura, empresas(nome, site_empresa_url)";

export async function buscarVagas(
  filtros: Filtros,
  idPerfil: string,
): Promise<VagaComDados[]> {
  const supabase = await createClient();

  let consulta = supabase.from("vagas").select(COLUNAS).eq("ativa", true);

  if (filtros.q) consulta = consulta.ilike("titulo", `%${filtros.q}%`);
  if (filtros.local) consulta = consulta.ilike("cidade", `%${filtros.local}%`);
  if (filtros.modalidade) consulta = consulta.eq("modalidade", filtros.modalidade);
  if (filtros.regime) consulta = consulta.eq("regime", filtros.regime);
  if (filtros.jornada) consulta = consulta.eq("jornada", filtros.jornada);

  const { data, error } = await consulta
    .order("publicada_em", { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);

  const vagas = (data ?? []) as unknown as Vaga[];
  if (vagas.length === 0) return [];

  const ids = vagas.map((vaga) => vaga.id);

  const [interacoes, compatibilidades] = await Promise.all([
    supabase
      .from("vaga_interacao")
      .select("idvagas, status")
      .eq("idperfil", idPerfil)
      .in("idvagas", ids),
    supabase
      .from("compatibilidade_vagas")
      .select("idvagas, porcentual")
      .in("idvagas", ids)
      .order("calculada_em", { ascending: false }),
  ]);

  const statusPorVaga = new Map<number, StatusInteracao>();
  for (const item of interacoes.data ?? []) {
    if (statusPorVaga.get(item.idvagas) !== "candidatou") {
      statusPorVaga.set(item.idvagas, item.status);
    }
  }

  const compatPorVaga = new Map<number, number>();
  for (const item of compatibilidades.data ?? []) {
    if (!compatPorVaga.has(item.idvagas)) {
      compatPorVaga.set(item.idvagas, item.porcentual);
    }
  }

  return vagas.map((vaga) => ({
    ...vaga,
    status: statusPorVaga.get(vaga.id) ?? null,
    compatibilidade: compatPorVaga.get(vaga.id) ?? null,
  }));
}