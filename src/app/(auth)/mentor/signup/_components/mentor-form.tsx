"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { Check, Link2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { AreaAtuacao } from "./area-atuacao"
import { CampoAjuda } from "./campo-ajuda"
import { CodigoConduta } from "./codigo-conduta"
import { EscolhaUnica } from "./escolha-unica"
import { campoFoco } from "./estilo-campo"

const tempos = ["Até 2 anos", "3 a 5 anos", "6 a 10 anos", "Mais de 10"]
const disponibilidades = ["1 a 2 conversas", "3 a 5 conversas", "Mais de 5"]

const vazio = {
  nome: "",
  email: "",
  linkedin: "",
  area: "",
  cargo: "",
  tempo: "",
  ajuda: "",
  disponibilidade: "",
  termos: false,
}

type Dados = typeof vazio

type Props = {
  onProgresso: (progresso: number) => void
  onEnviado: () => void
}

export function MentorForm({ onProgresso, onEnviado }: Props) {
  const [dados, setDados] = useState<Dados>(vazio)
  const [tentou, setTentou] = useState(false)
  const [enviado, setEnviado] = useState(false)

  function atualizar<K extends keyof Dados>(campo: K, valor: Dados[K]) {
    setDados((atual) => ({ ...atual, [campo]: valor }))
  }

  // Cada campo preenchido conta um pedaço do caminho no painel azul.
  const respostas = [
    dados.nome.trim(),
    dados.email.trim(),
    dados.linkedin.trim(),
    dados.area.trim(),
    dados.cargo.trim(),
    dados.tempo,
    dados.ajuda.trim(),
    dados.disponibilidade,
    dados.termos,
  ]
  const preenchidos = respostas.filter(Boolean).length
  const total = respostas.length

  useEffect(() => {
    onProgresso(preenchidos / total)
  }, [preenchidos, total, onProgresso])

  const faltaTempo = tentou && !dados.tempo
  const faltaDisponibilidade = tentou && !dados.disponibilidade
  const faltaTermos = tentou && !dados.termos

  function enviar(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setTentou(true)
    if (!dados.tempo || !dados.disponibilidade || !dados.termos) return

    // TODO: salvar na tabela solicitacao_mentor (Supabase).
    // Por enquanto a solicitação só aparece como enviada na tela.
    setEnviado(true)
    onEnviado()
  }

  if (enviado) {
    const primeiroNome = dados.nome.trim().split(" ")[0]
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex min-h-112 flex-col items-start justify-center gap-4"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300">
          <Check className="size-6" strokeWidth={2.5} />
        </span>
        <h1 className="font-(family-name:--font-display) text-[1.9rem] font-semibold leading-tight tracking-tight">
          Recebemos sua solicitação, {primeiroNome}.
        </h1>
        <p className="max-w-md text-muted-foreground">
          Nosso time vai olhar seu perfil e responder em{" "}
          <span className="font-medium text-foreground">{dados.email}</span> em
          até 2 dias úteis.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-8">
      <div>
        <h1 className="font-(family-name:--font-display) text-[2.1rem] font-semibold leading-[1.05] tracking-tight">
          Solicitar acesso de mentor
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Conte um pouco sobre você. Respondemos no email informado.
        </p>
      </div>

      <FieldGroup className="gap-7">
        <div className="grid gap-7 sm:grid-cols-2 sm:gap-6">
          <Field>
            <FieldLabel htmlFor="nome">Nome completo</FieldLabel>
            <Input
              id="nome"
              name="nome_completo"
              value={dados.nome}
              onChange={(e) => atualizar("nome", e.target.value)}
              placeholder="Seu nome"
              autoComplete="name"
              required
              className={campoFoco}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              value={dados.email}
              onChange={(e) => atualizar("email", e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              required
              className={campoFoco}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="linkedin">LinkedIn</FieldLabel>
          <div className="relative">
            <Input
              id="linkedin"
              name="linkedin_url"
              value={dados.linkedin}
              onChange={(e) => atualizar("linkedin", e.target.value)}
              placeholder="linkedin.com/in/seu-perfil"
              required
              className={`${campoFoco} pr-7`}
            />
            <Link2
              aria-hidden
              className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
          </div>
          <FieldDescription>
            Usamos o LinkedIn para confirmar sua experiência.
          </FieldDescription>
        </Field>

        <div className="grid gap-7 sm:grid-cols-2 sm:gap-6">
          <AreaAtuacao
            valor={dados.area}
            onChange={(v) => atualizar("area", v)}
          />
          <Field>
            <FieldLabel htmlFor="cargo">Cargo e empresa atual</FieldLabel>
            <Input
              id="cargo"
              name="cargo_empresa_atual"
              value={dados.cargo}
              onChange={(e) => atualizar("cargo", e.target.value)}
              placeholder="Ex.: Recrutador de talentos na Acme"
              required
              className={campoFoco}
            />
          </Field>
        </div>

        <EscolhaUnica
          rotulo="Tempo de experiência"
          name="tempo_experiencia"
          variante="escala"
          opcoes={tempos}
          valor={dados.tempo}
          onChange={(v) => atualizar("tempo", v)}
          erro={faltaTempo ? "Escolha uma opção." : undefined}
        />

        <CampoAjuda
          valor={dados.ajuda}
          onChange={(v) => atualizar("ajuda", v)}
        />

        <EscolhaUnica
          rotulo="Disponibilidade por mês"
          name="disponibilidade_mes"
          variante="chips"
          opcoes={disponibilidades}
          valor={dados.disponibilidade}
          onChange={(v) => atualizar("disponibilidade", v)}
          erro={faltaDisponibilidade ? "Escolha uma opção." : undefined}
        />

        <CodigoConduta
          aceito={dados.termos}
          onAceitar={() => atualizar("termos", true)}
          onDesfazer={() => atualizar("termos", false)}
          erro={faltaTermos ? "Leia e aceite o código de conduta." : undefined}
        />
      </FieldGroup>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          className="flex h-12 w-full items-center justify-center rounded-lg bg-[#0b1437] text-sm font-medium text-white outline-none transition-colors hover:bg-[#13265e] focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          Enviar solicitação
        </button>
        <p className="text-center text-xs text-muted-foreground">
          Resposta em até 2 dias úteis, direto no seu email.
        </p>
      </div>
    </form>
  )
}
