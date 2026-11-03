// Dados de exemplo da Home. Quando a API existir, é aqui que eles serão trocados.

export type ProximoPassoDados = {
  etiqueta: string;
  titulo: string;
  descricao: string;
  progresso: number;
  textoPrincipal: string;
  linkPrincipal: string;
  textoSecundario: string;
  linkSecundario: string;
};

export type CardAcaoDados = {
  titulo: string;
  descricao: string;
  textoBotao: string;
  link: string;
};

export type Etapa = {
  numero: number;
  titulo: string;
  subtitulo: string;
  status: "ativa" | "pendente";
};

type EstadoHome = {
  saudacao: string;
  subtitulo: string;
  proximoPasso: ProximoPassoDados;
  cardsLaterais: CardAcaoDados[];
};

type HomeDados = {
  temCurriculo: boolean;
  usuario: { nome: string };
  realizar: EstadoHome;
  primeiroUso: EstadoHome;
  etapas: Etapa[];
};

export const homeMock: HomeDados = {
  // false mostra "Primeiro uso"; true mostra "Realizar"
  temCurriculo: false,
  usuario: { nome: "Usuário" },

  realizar: {
    saudacao: "Olá",
    subtitulo: "Veja o que falta para você se candidatar com confiança",
    proximoPasso: {
      etiqueta: "Seu próximo passo",
      titulo: "Seu currículo está 72% pronto para vagas de Front-end Júnior",
      descricao:
        "Adicione dois projetos com links e descreva suas experiências com React para chegar a 90%.",
      progresso: 72,
      textoPrincipal: "Continuar meu currículo",
      linkPrincipal: "/analise-curriculo",
      textoSecundario: "Ver análise completa",
      linkSecundario: "/analise-curriculo",
    },
    cardsLaterais: [
      {
        titulo: "Treine para sua próxima entrevista",
        descricao:
          "Simule uma entrevista para Front-end Júnior e receba um retorno sobre suas respostas em 15 minutos.",
        textoBotao: "Começar simulação",
        link: "/entrevista-ia",
      },
    ],
  },

  primeiroUso: {
    saudacao: "Boas-vindas",
    subtitulo:
      "Seu perfil ainda está vazio. Comece pelo currículo e a gente mostra as vagas que combinam com você.",
    proximoPasso: {
      etiqueta: "Primeiro passo, 1 de 4",
      titulo: "Envie seu currículo e receba sua primeira análise",
      descricao:
        "Leva cerca de 2 minutos. Lemos sua experiência e mostramos o que ajustar, com exemplos.",
      progresso: 4,
      textoPrincipal: "Enviar meu currículo",
      linkPrincipal: "/analise-curriculo",
      textoSecundario: "Montar do zero",
      linkSecundario: "/analise-curriculo",
    },
    cardsLaterais: [
      {
        titulo: "Treine para sua próxima entrevista",
        descricao:
          "Pratique com uma entrevista simulada por IA. Treine após enviar o seu currículo",
        textoBotao: "Começar simulação",
        link: "/entrevista-ia",
      },
      {
        titulo: "Conheça a trilha de cursos",
        descricao:
          "Cursos rápidos e com certifições, para alavancar ainda mais o seu currículo.",
        textoBotao: "Ver trilha",
        link: "/cursos",
      },
    ],
  },

  etapas: [
    {
      numero: 1,
      titulo: "Enviar seu currículo",
      subtitulo: "PDF ou Word, até 5 MB",
      status: "ativa",
    },
    {
      numero: 2,
      titulo: "Receber a análise",
      subtitulo: "Pontos fortes e o que ajustar",
      status: "pendente",
    },
    {
      numero: 3,
      titulo: "Ver vagas compatíveis",
      subtitulo: "Ordenadas por compatibilidade",
      status: "pendente",
    },
    {
      numero: 4,
      titulo: "Agendar análise com o RH",
      subtitulo: "Conversa de 30 min com uma mentora",
      status: "pendente",
    },
  ],
};
