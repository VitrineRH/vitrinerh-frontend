export type StatusInteracao = "salva" | "candidatou";

export type Vaga = {
    id: number;
    titulo:string;
    descricao: string;
    requisitos: string;
    beneficios: string;
    cidade: string;
    uf: string;
    regime: string | null;
    modalidade: string | null;
    jornada: string | null;
    salario_min: number | null;
    salario_max: number | null;
    publicada_em: string | null;
    url_candidatura: string | null;
    empresas: { nome: string; site_empresa_url: string | null} | null;
};

export type VagaComDados = Vaga & {
    compatibilidade: number | null;
    status: StatusInteracao | null;
};

export type Filtros ={
    q: string;
    local: string;
    modalidade: string;
    regime:string;
    jornada: string;
    vaga: string;
};

//ele só descreve o formato dos dados, para o typescript avisar quando escreve algo errado
