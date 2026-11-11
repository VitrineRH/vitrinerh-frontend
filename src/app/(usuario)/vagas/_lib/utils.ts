import type {Filtros} from "./tipos";

export const MODALIDADES = ["Presencial", "Hibrido", "Remoto"];
export const REGIMES =["CLT", "PJ", "Estagio", "Jovem aprendiz", "Temporario", "Trainee"];
export const JORNADAS = ["Integral", "Meio periodo"];

const ROTULOS: Record<string, string> = {
  Hibrido: "Híbrido",
  Estagio: "Estágio",
  Temporario: "Temporário",
  "Meio periodo": "Meio período",
};

export function rotulo(valor:string | null) {
    if (!valor) return "";
    return ROTULOS[valor] ?? valor;
}

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function formatarSalario(min: number |null, max: number | null) {
  if(min && max) return `${moeda.format(min)} a ${moeda.format(max)}`;
  if (min) return `A partir de ${moeda.format(min)}`;
  if (max) return `Até ${moeda.format(max)}`;
  return "Salário a combinar";  
}

export function tempoPublicada(data: string | null){
  if (!data) return "";
  const dias = Math.floor((Date.now() - new Date(data).getTime()) / 86_400_000);
  if (dias <=0) return "Publicada hoje";
  if (dias === 1) return "Publicada ontem";
  return `Publicada há ${dias} dias`; 
}

export function lerFiltros(
  params: Record<string, string | string[] | undefined>,
):Filtros {
  const ler= (chave: string) => {
    const valor = params[chave];
    return typeof valor === "string" ? valor.trim() : "";
  };
  


return {
  q: ler ("q"),
  local : ler("local"),
  modalidade: ler("modalidade"),
  regime: ler("regime"),
  jornada: ler("jornada"),
  vaga: ler("vaga"),
};
}

 export function hrefVagas(filtro: Filtros, idVaga?: number) {
  const params = new URLSearchParams();
  for (const [chave, valor] of Object.entries(filtro)){
    if (valor && chave !== "vaga") params.set(chave, valor);
  }
  if (idVaga) params.set("vaga", String(idVaga));
  const texto = params.toString();
  return texto? `/vagas?${texto}` : "/vagas";
 }