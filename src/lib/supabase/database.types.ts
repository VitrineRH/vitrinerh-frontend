// Gerado a partir do banco do Supabase. Para atualizar depois de mudar o banco:
// npx supabase gen types typescript --project-id <id-do-projeto> > src/lib/supabase/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      analise_curriculo: {
        Row: {
          cargo_alvo: string | null
          classificacao: string | null
          compatibilidade_cargo: number | null
          criada_em: string
          empresa_alvo: string | null
          id: number
          idcurriculo: number
          pontos_fortes: string[]
          pontos_melhoria: string[]
          pontuacao_geral: number | null
          resumo: string | null
          status: Database["public"]["Enums"]["status_analise"]
        }
        Insert: {
          cargo_alvo?: string | null
          classificacao?: string | null
          compatibilidade_cargo?: number | null
          criada_em?: string
          empresa_alvo?: string | null
          id?: never
          idcurriculo: number
          pontos_fortes?: string[]
          pontos_melhoria?: string[]
          pontuacao_geral?: number | null
          resumo?: string | null
          status?: Database["public"]["Enums"]["status_analise"]
        }
        Update: {
          cargo_alvo?: string | null
          classificacao?: string | null
          compatibilidade_cargo?: number | null
          criada_em?: string
          empresa_alvo?: string | null
          id?: never
          idcurriculo?: number
          pontos_fortes?: string[]
          pontos_melhoria?: string[]
          pontuacao_geral?: number | null
          resumo?: string | null
          status?: Database["public"]["Enums"]["status_analise"]
        }
        Relationships: [
          {
            foreignKeyName: "analise_curriculo_idcurriculo_fkey"
            columns: ["idcurriculo"]
            isOneToOne: false
            referencedRelation: "curriculo"
            referencedColumns: ["id"]
          },
        ]
      }
      aponta_falta: {
        Row: {
          idanalise_curriculo: number
          idhabilidade: number
        }
        Insert: {
          idanalise_curriculo: number
          idhabilidade: number
        }
        Update: {
          idanalise_curriculo?: number
          idhabilidade?: number
        }
        Relationships: [
          {
            foreignKeyName: "aponta_falta_idanalise_curriculo_fkey"
            columns: ["idanalise_curriculo"]
            isOneToOne: false
            referencedRelation: "analise_curriculo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aponta_falta_idhabilidade_fkey"
            columns: ["idhabilidade"]
            isOneToOne: false
            referencedRelation: "habilidade"
            referencedColumns: ["id"]
          },
        ]
      }
      assinatura: {
        Row: {
          cancelada_em: string | null
          expira_em: string | null
          id: number
          idperfil: string
          idplanos: string
          iniciada_em: string
          status: Database["public"]["Enums"]["status_assinatura_p"]
        }
        Insert: {
          cancelada_em?: string | null
          expira_em?: string | null
          id?: never
          idperfil: string
          idplanos: string
          iniciada_em?: string
          status?: Database["public"]["Enums"]["status_assinatura_p"]
        }
        Update: {
          cancelada_em?: string | null
          expira_em?: string | null
          id?: never
          idperfil?: string
          idplanos?: string
          iniciada_em?: string
          status?: Database["public"]["Enums"]["status_assinatura_p"]
        }
        Relationships: [
          {
            foreignKeyName: "assinatura_idperfil_fkey"
            columns: ["idperfil"]
            isOneToOne: false
            referencedRelation: "perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assinatura_idplanos_fkey"
            columns: ["idplanos"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
        ]
      }
      compatibilidade_vagas: {
        Row: {
          calculada_em: string
          id: number
          idanalise_curriculo: number
          idvagas: number
          porcentual: number | null
        }
        Insert: {
          calculada_em?: string
          id?: never
          idanalise_curriculo: number
          idvagas: number
          porcentual?: number | null
        }
        Update: {
          calculada_em?: string
          id?: never
          idanalise_curriculo?: number
          idvagas?: number
          porcentual?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "compatibilidade_vagas_idanalise_curriculo_fkey"
            columns: ["idanalise_curriculo"]
            isOneToOne: false
            referencedRelation: "analise_curriculo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compatibilidade_vagas_idvagas_fkey"
            columns: ["idvagas"]
            isOneToOne: false
            referencedRelation: "vagas"
            referencedColumns: ["id"]
          },
        ]
      }
      criterio_analise: {
        Row: {
          criterio: string
          idanalise_curriculo: number
          nota: number | null
        }
        Insert: {
          criterio: string
          idanalise_curriculo: number
          nota?: number | null
        }
        Update: {
          criterio?: string
          idanalise_curriculo?: number
          nota?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "criterio_analise_idanalise_curriculo_fkey"
            columns: ["idanalise_curriculo"]
            isOneToOne: false
            referencedRelation: "analise_curriculo"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculo: {
        Row: {
          enviado_em: string
          formato: Database["public"]["Enums"]["formato_arquivo"] | null
          id: number
          idperfil: string
          nome_arquivo: string
          status: Database["public"]["Enums"]["status_enviado"]
          storage_url: string
          tamanho_bytes: number | null
        }
        Insert: {
          enviado_em?: string
          formato?: Database["public"]["Enums"]["formato_arquivo"] | null
          id?: never
          idperfil: string
          nome_arquivo: string
          status?: Database["public"]["Enums"]["status_enviado"]
          storage_url: string
          tamanho_bytes?: number | null
        }
        Update: {
          enviado_em?: string
          formato?: Database["public"]["Enums"]["formato_arquivo"] | null
          id?: never
          idperfil?: string
          nome_arquivo?: string
          status?: Database["public"]["Enums"]["status_enviado"]
          storage_url?: string
          tamanho_bytes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "curriculo_idperfil_fkey"
            columns: ["idperfil"]
            isOneToOne: false
            referencedRelation: "perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      curso: {
        Row: {
          beneficios: string | null
          carga_horaria_h: number | null
          cidade: string
          descricao: string
          emite_certificado: boolean
          gratuito: boolean
          id: string
          instituicao_nome: string
          licoes: string | null
          link_externo_curso: string | null
          modalidade: string | null
          site_instituicao_url: string | null
          titulo: string
          turno: string | null
          uf: string | null
        }
        Insert: {
          beneficios?: string | null
          carga_horaria_h?: number | null
          cidade: string
          descricao: string
          emite_certificado?: boolean
          gratuito?: boolean
          id?: string
          instituicao_nome: string
          licoes?: string | null
          link_externo_curso?: string | null
          modalidade?: string | null
          site_instituicao_url?: string | null
          titulo: string
          turno?: string | null
          uf?: string | null
        }
        Update: {
          beneficios?: string | null
          carga_horaria_h?: number | null
          cidade?: string
          descricao?: string
          emite_certificado?: boolean
          gratuito?: boolean
          id?: string
          instituicao_nome?: string
          licoes?: string | null
          link_externo_curso?: string | null
          modalidade?: string | null
          site_instituicao_url?: string | null
          titulo?: string
          turno?: string | null
          uf?: string | null
        }
        Relationships: []
      }
      desenvolve: {
        Row: {
          idcurso: string
          idhabilidade: number
        }
        Insert: {
          idcurso: string
          idhabilidade: number
        }
        Update: {
          idcurso?: string
          idhabilidade?: number
        }
        Relationships: [
          {
            foreignKeyName: "desenvolve_idcurso_fkey"
            columns: ["idcurso"]
            isOneToOne: false
            referencedRelation: "curso"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "desenvolve_idhabilidade_fkey"
            columns: ["idhabilidade"]
            isOneToOne: false
            referencedRelation: "habilidade"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          cidade: string
          id: string
          nome: string
          site_empresa_url: string | null
          uf: string | null
        }
        Insert: {
          cidade: string
          id?: string
          nome: string
          site_empresa_url?: string | null
          uf?: string | null
        }
        Update: {
          cidade?: string
          id?: string
          nome?: string
          site_empresa_url?: string | null
          uf?: string | null
        }
        Relationships: []
      }
      entrevista_ia: {
        Row: {
          agendada_para: string
          cargo_foco: string
          consentimento_observacao: boolean
          duracao_prevista_min: number | null
          id: number
          idanalise_curriculo: number
          idioma: string
          idperfil: string
          pontuacao_geral: number | null
          qtd_perguntas: number | null
          resumo: string
          salvar_historico: boolean
          status: Database["public"]["Enums"]["status_entrevista_ia"]
        }
        Insert: {
          agendada_para: string
          cargo_foco: string
          consentimento_observacao?: boolean
          duracao_prevista_min?: number | null
          id?: never
          idanalise_curriculo: number
          idioma?: string
          idperfil: string
          pontuacao_geral?: number | null
          qtd_perguntas?: number | null
          resumo: string
          salvar_historico?: boolean
          status?: Database["public"]["Enums"]["status_entrevista_ia"]
        }
        Update: {
          agendada_para?: string
          cargo_foco?: string
          consentimento_observacao?: boolean
          duracao_prevista_min?: number | null
          id?: never
          idanalise_curriculo?: number
          idioma?: string
          idperfil?: string
          pontuacao_geral?: number | null
          qtd_perguntas?: number | null
          resumo?: string
          salvar_historico?: boolean
          status?: Database["public"]["Enums"]["status_entrevista_ia"]
        }
        Relationships: [
          {
            foreignKeyName: "entrevista_ia_idanalise_curriculo_fkey"
            columns: ["idanalise_curriculo"]
            isOneToOne: false
            referencedRelation: "analise_curriculo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entrevista_ia_idperfil_fkey"
            columns: ["idperfil"]
            isOneToOne: false
            referencedRelation: "perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_entrevista_item: {
        Row: {
          categoria: Database["public"]["Enums"]["categoria_feedback"]
          descricao: string | null
          id: number
          identrevista_ia: number
          ordem: number
          titulo: string
        }
        Insert: {
          categoria: Database["public"]["Enums"]["categoria_feedback"]
          descricao?: string | null
          id?: never
          identrevista_ia: number
          ordem?: number
          titulo: string
        }
        Update: {
          categoria?: Database["public"]["Enums"]["categoria_feedback"]
          descricao?: string | null
          id?: never
          identrevista_ia?: number
          ordem?: number
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_entrevista_item_identrevista_ia_fkey"
            columns: ["identrevista_ia"]
            isOneToOne: false
            referencedRelation: "entrevista_ia"
            referencedColumns: ["id"]
          },
        ]
      }
      habilidade: {
        Row: {
          categoria: string | null
          id: number
          nome: string
        }
        Insert: {
          categoria?: string | null
          id?: never
          nome: string
        }
        Update: {
          categoria?: string | null
          id?: never
          nome?: string
        }
        Relationships: []
      }
      horario_disponivel: {
        Row: {
          fim: string
          id: number
          idmentor: string
          inicio: string
          status: Database["public"]["Enums"]["status_horario_disp"]
        }
        Insert: {
          fim: string
          id?: never
          idmentor: string
          inicio: string
          status?: Database["public"]["Enums"]["status_horario_disp"]
        }
        Update: {
          fim?: string
          id?: never
          idmentor?: string
          inicio?: string
          status?: Database["public"]["Enums"]["status_horario_disp"]
        }
        Relationships: [
          {
            foreignKeyName: "horario_disponivel_idmentor_fkey"
            columns: ["idmentor"]
            isOneToOne: false
            referencedRelation: "mentor"
            referencedColumns: ["id"]
          },
        ]
      }
      inscricao_curso: {
        Row: {
          id: number
          idcurso: string
          idperfil: string
          inscrito_em: string
          status: Database["public"]["Enums"]["status_inscricao"]
        }
        Insert: {
          id?: never
          idcurso: string
          idperfil: string
          inscrito_em?: string
          status?: Database["public"]["Enums"]["status_inscricao"]
        }
        Update: {
          id?: never
          idcurso?: string
          idperfil?: string
          inscrito_em?: string
          status?: Database["public"]["Enums"]["status_inscricao"]
        }
        Relationships: [
          {
            foreignKeyName: "inscricao_curso_idcurso_fkey"
            columns: ["idcurso"]
            isOneToOne: false
            referencedRelation: "curso"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inscricao_curso_idperfil_fkey"
            columns: ["idperfil"]
            isOneToOne: false
            referencedRelation: "perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      interacao_ia: {
        Row: {
          data_interacao: string
          id: number
          idperfil: string
          pergunta: string
          resposta: string | null
          tokens_utilizados: number | null
        }
        Insert: {
          data_interacao?: string
          id?: never
          idperfil: string
          pergunta: string
          resposta?: string | null
          tokens_utilizados?: number | null
        }
        Update: {
          data_interacao?: string
          id?: never
          idperfil?: string
          pergunta?: string
          resposta?: string | null
          tokens_utilizados?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "interacao_ia_idperfil_fkey"
            columns: ["idperfil"]
            isOneToOne: false
            referencedRelation: "perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor: {
        Row: {
          atende_libras: boolean
          atividades: string | null
          bio: string | null
          cargo_atual: string | null
          experiencias: string | null
          formacoes: string
          foto_url: string
          id: string
          idiomas: string
          idperfil: string
          idsolicitao_mentor: number
          taxa_porcentual: number
          valor_sessao: number | null
        }
        Insert: {
          atende_libras?: boolean
          atividades?: string | null
          bio?: string | null
          cargo_atual?: string | null
          experiencias?: string | null
          formacoes: string
          foto_url: string
          id?: string
          idiomas: string
          idperfil: string
          idsolicitao_mentor: number
          taxa_porcentual?: number
          valor_sessao?: number | null
        }
        Update: {
          atende_libras?: boolean
          atividades?: string | null
          bio?: string | null
          cargo_atual?: string | null
          experiencias?: string | null
          formacoes?: string
          foto_url?: string
          id?: string
          idiomas?: string
          idperfil?: string
          idsolicitao_mentor?: number
          taxa_porcentual?: number
          valor_sessao?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mentor_idperfil_fkey"
            columns: ["idperfil"]
            isOneToOne: true
            referencedRelation: "perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_idsolicitao_mentor_fkey"
            columns: ["idsolicitao_mentor"]
            isOneToOne: true
            referencedRelation: "solicitacao_mentor"
            referencedColumns: ["id"]
          },
        ]
      }
      mentoria: {
        Row: {
          avaliacao_comentario: string | null
          avaliacao_nota: number | null
          cancelada_em: string | null
          criada_em: string
          id: number
          idhorario_disponivel: number
          idmentor: string
          idperfil: string
          link_chamada: string | null
          status: Database["public"]["Enums"]["status_mentoria"]
          taxa_plataforma: number | null
          tipo: string | null
          valor: number | null
          valor_mentor: number | null
        }
        Insert: {
          avaliacao_comentario?: string | null
          avaliacao_nota?: number | null
          cancelada_em?: string | null
          criada_em?: string
          id?: never
          idhorario_disponivel: number
          idmentor: string
          idperfil: string
          link_chamada?: string | null
          status?: Database["public"]["Enums"]["status_mentoria"]
          taxa_plataforma?: number | null
          tipo?: string | null
          valor?: number | null
          valor_mentor?: number | null
        }
        Update: {
          avaliacao_comentario?: string | null
          avaliacao_nota?: number | null
          cancelada_em?: string | null
          criada_em?: string
          id?: never
          idhorario_disponivel?: number
          idmentor?: string
          idperfil?: string
          link_chamada?: string | null
          status?: Database["public"]["Enums"]["status_mentoria"]
          taxa_plataforma?: number | null
          tipo?: string | null
          valor?: number | null
          valor_mentor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mentoria_idhorario_disponivel_fkey"
            columns: ["idhorario_disponivel"]
            isOneToOne: false
            referencedRelation: "horario_disponivel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentoria_idmentor_fkey"
            columns: ["idmentor"]
            isOneToOne: false
            referencedRelation: "mentor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentoria_idperfil_fkey"
            columns: ["idperfil"]
            isOneToOne: false
            referencedRelation: "perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacao: {
        Row: {
          criada_em: string
          id: string
          idperfil: string
          lida: boolean
          mensagem: string
          tipo: string
          titulo: string
        }
        Insert: {
          criada_em?: string
          id?: string
          idperfil: string
          lida?: boolean
          mensagem: string
          tipo: string
          titulo: string
        }
        Update: {
          criada_em?: string
          id?: string
          idperfil?: string
          lida?: boolean
          mensagem?: string
          tipo?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacao_idperfil_fkey"
            columns: ["idperfil"]
            isOneToOne: false
            referencedRelation: "perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamento: {
        Row: {
          criado_em: string
          desconto: number
          gateway_transicao_id: string | null
          id: number
          idassinatura: number
          metodo: Database["public"]["Enums"]["metodo_pagamento"] | null
          pago_em: string | null
          parcelas: number
          status: Database["public"]["Enums"]["status_pagamento"]
          subtotal: number
          total: number
        }
        Insert: {
          criado_em?: string
          desconto?: number
          gateway_transicao_id?: string | null
          id?: never
          idassinatura: number
          metodo?: Database["public"]["Enums"]["metodo_pagamento"] | null
          pago_em?: string | null
          parcelas?: number
          status?: Database["public"]["Enums"]["status_pagamento"]
          subtotal: number
          total: number
        }
        Update: {
          criado_em?: string
          desconto?: number
          gateway_transicao_id?: string | null
          id?: never
          idassinatura?: number
          metodo?: Database["public"]["Enums"]["metodo_pagamento"] | null
          pago_em?: string | null
          parcelas?: number
          status?: Database["public"]["Enums"]["status_pagamento"]
          subtotal?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamento_idassinatura_fkey"
            columns: ["idassinatura"]
            isOneToOne: false
            referencedRelation: "assinatura"
            referencedColumns: ["id"]
          },
        ]
      }
      perfil: {
        Row: {
          bio: string | null
          cidade: string | null
          cpf: string | null
          criado_em: string
          data_nascimento: string | null
          email_contato: string
          id: string
          linkedin_url: string | null
          motivacao_desativacao: string | null
          nome_completo: string
          status: Database["public"]["Enums"]["status_conta"] | null
          telefone: string | null
          tipo: Database["public"]["Enums"]["tipo_perfil"] | null
          uf: string | null
        }
        Insert: {
          bio?: string | null
          cidade?: string | null
          cpf?: string | null
          criado_em?: string
          data_nascimento?: string | null
          email_contato: string
          id: string
          linkedin_url?: string | null
          motivacao_desativacao?: string | null
          nome_completo: string
          status?: Database["public"]["Enums"]["status_conta"] | null
          telefone?: string | null
          tipo?: Database["public"]["Enums"]["tipo_perfil"] | null
          uf?: string | null
        }
        Update: {
          bio?: string | null
          cidade?: string | null
          cpf?: string | null
          criado_em?: string
          data_nascimento?: string | null
          email_contato?: string
          id?: string
          linkedin_url?: string | null
          motivacao_desativacao?: string | null
          nome_completo?: string
          status?: Database["public"]["Enums"]["status_conta"] | null
          telefone?: string | null
          tipo?: Database["public"]["Enums"]["tipo_perfil"] | null
          uf?: string | null
        }
        Relationships: []
      }
      pergunta_entrevista: {
        Row: {
          avaliacao: string
          enunciado: string
          id: number
          identrevista_ia: number
          ordem: number
          respondida_em: string | null
          transcricao: string | null
        }
        Insert: {
          avaliacao: string
          enunciado: string
          id?: never
          identrevista_ia: number
          ordem: number
          respondida_em?: string | null
          transcricao?: string | null
        }
        Update: {
          avaliacao?: string
          enunciado?: string
          id?: never
          identrevista_ia?: number
          ordem?: number
          respondida_em?: string | null
          transcricao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pergunta_entrevista_identrevista_ia_fkey"
            columns: ["identrevista_ia"]
            isOneToOne: false
            referencedRelation: "entrevista_ia"
            referencedColumns: ["id"]
          },
        ]
      }
      planos: {
        Row: {
          historico_completo: boolean
          id: string
          incluir_entrevista_ia: boolean
          limite_analise: number | null
          limite_compatibilidade: number | null
          limite_conversa_ia: number | null
          nome: string
          preco_mensal: number
        }
        Insert: {
          historico_completo?: boolean
          id?: string
          incluir_entrevista_ia?: boolean
          limite_analise?: number | null
          limite_compatibilidade?: number | null
          limite_conversa_ia?: number | null
          nome: string
          preco_mensal?: number
        }
        Update: {
          historico_completo?: boolean
          id?: string
          incluir_entrevista_ia?: boolean
          limite_analise?: number | null
          limite_compatibilidade?: number | null
          limite_conversa_ia?: number | null
          nome?: string
          preco_mensal?: number
        }
        Relationships: []
      }
      solicitacao_mentor: {
        Row: {
          area_atuacao: string
          cargo_empresa_atual: string | null
          codigo_conduta: boolean
          como_ajudar: string
          disponibilidade_mes: string
          email: string
          enviada_em: string
          id: number
          linkedin_url: string
          nome_completa: string
          prazo_resposta: string | null
          status: Database["public"]["Enums"]["status_solicitacao"]
          tempo_experiencia: string
        }
        Insert: {
          area_atuacao: string
          cargo_empresa_atual?: string | null
          codigo_conduta: boolean
          como_ajudar: string
          disponibilidade_mes: string
          email: string
          enviada_em?: string
          id?: never
          linkedin_url: string
          nome_completa: string
          prazo_resposta?: string | null
          status?: Database["public"]["Enums"]["status_solicitacao"]
          tempo_experiencia: string
        }
        Update: {
          area_atuacao?: string
          cargo_empresa_atual?: string | null
          codigo_conduta?: boolean
          como_ajudar?: string
          disponibilidade_mes?: string
          email?: string
          enviada_em?: string
          id?: never
          linkedin_url?: string
          nome_completa?: string
          prazo_resposta?: string | null
          status?: Database["public"]["Enums"]["status_solicitacao"]
          tempo_experiencia?: string
        }
        Relationships: []
      }
      vaga_interacao: {
        Row: {
          criada_em: string
          id: number
          idperfil: string
          idvagas: number
          status: Database["public"]["Enums"]["status_interacao"]
        }
        Insert: {
          criada_em?: string
          id?: never
          idperfil: string
          idvagas: number
          status?: Database["public"]["Enums"]["status_interacao"]
        }
        Update: {
          criada_em?: string
          id?: never
          idperfil?: string
          idvagas?: number
          status?: Database["public"]["Enums"]["status_interacao"]
        }
        Relationships: [
          {
            foreignKeyName: "vaga_interacao_idperfil_fkey"
            columns: ["idperfil"]
            isOneToOne: false
            referencedRelation: "perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vaga_interacao_idvagas_fkey"
            columns: ["idvagas"]
            isOneToOne: false
            referencedRelation: "vagas"
            referencedColumns: ["id"]
          },
        ]
      }
      vagas: {
        Row: {
          ativa: boolean
          beneficios: string
          cidade: string
          descricao: string
          fonte: string
          id: number
          id_externo: string
          idempresa: string
          jornada: string | null
          modalidade: string | null
          publicada_em: string | null
          regime: string | null
          requisitos: string
          salario_max: number | null
          salario_min: number | null
          titulo: string
          uf: string
          url_candidatura: string | null
        }
        Insert: {
          ativa?: boolean
          beneficios: string
          cidade: string
          descricao: string
          fonte: string
          id?: never
          id_externo: string
          idempresa: string
          jornada?: string | null
          modalidade?: string | null
          publicada_em?: string | null
          regime?: string | null
          requisitos: string
          salario_max?: number | null
          salario_min?: number | null
          titulo: string
          uf: string
          url_candidatura?: string | null
        }
        Update: {
          ativa?: boolean
          beneficios?: string
          cidade?: string
          descricao?: string
          fonte?: string
          id?: never
          id_externo?: string
          idempresa?: string
          jornada?: string | null
          modalidade?: string | null
          publicada_em?: string | null
          regime?: string | null
          requisitos?: string
          salario_max?: number | null
          salario_min?: number | null
          titulo?: string
          uf?: string
          url_candidatura?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vagas_idempresa_fkey"
            columns: ["idempresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      categoria_feedback: "foi_bem" | "melhorar" | "proximo_passo"
      formato_arquivo: "pdf" | "docx" | "doc"
      metodo_pagamento: "pix" | "credito" | "debito"
      status_analise: "processando" | "concluida" | "erro"
      status_assinatura: "ativo" | "cancelada" | "expirada" | "pendente"
      status_assinatura_p: "pendente" | "ativa" | "cancelada" | "expirada"
      status_conta: "ativo" | "desativado"
      status_entrevista_ia:
        | "agendada"
        | "em_agendamento"
        | "concluida"
        | "cancelada"
      status_enviado: "pendente" | "enviado" | "falhou"
      status_horario_disp: "livre" | "reservado" | "bloqueado"
      status_inscricao: "salvo" | "inscrito" | "concluido" | "cancelado"
      status_interacao: "salva" | "candidatou"
      status_mentoria:
        | "aguardando_pagamento"
        | "confirmada"
        | "concluida"
        | "cancelada"
      status_pagamento: "pendente" | "aprovado" | "recusado" | "estornado"
      status_solicitacao: "em_analise" | "aprovada" | "recusada"
      tipo_perfil: "candidato" | "mentor" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database["public"]

export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"]
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T]
