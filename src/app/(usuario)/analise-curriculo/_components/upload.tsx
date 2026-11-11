"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { DropzoneUploadFileRow, HaloDropzone } from "@/components/ui/halo-dropzone"
import enviarCurriculo from "@/app/(usuario)/actions"

const limite = 5 * 1024 * 1024

const Upload = () => {
    const router = useRouter()
    const [arquivo, setArquivo] = useState<File | null>(null)
    const [enviando, setEnviando] = useState(false)
    const [erro, setErro] = useState<string>()

    const escolher = (files: File[]) => {
        const f = files[0]
        setErro(undefined)
        if (!f) return
        if (f.type !== "application/pdf") return setErro("O arquivo precisa ser um PDF.")
        if (f.size > limite) return setErro("O arquivo é muito grande, o limite é 5MB.")
        setArquivo(f)
    }

    const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!arquivo) return setErro("Selecione seu currículo para continuar.")

        const formData = new FormData(e.currentTarget)
        formData.set("arquivo", arquivo)

        setEnviando(true)
        const res = await enviarCurriculo(formData)
        setEnviando(false)

        if (res.error) return setErro(res.error)
        router.push(`/analise-curriculo/${res.id}`)
    }

    return (
        <form onSubmit={enviar} className="mx-auto flex flex-col w-full max-w-2xl gap-6">
            <HaloDropzone
                accept="application/pdf"
                disabled={enviando}
                onFiles={escolher}
                emptyLabel="Arraste seu currículo aqui ou clique para escolher"
                formatHint="PDF de até 5MB"
                successLabel="Currículo selecionado"
                showSuccessThumbnails={false}
                successResetMs={1600}
            />

            {arquivo && (
                <DropzoneUploadFileRow
                    file={arquivo}
                    progress={100}
                    complete
                    onRemove={enviando ? undefined : () => setArquivo(null)}
                />
            )}

            <div className="grid gap-6 sm:grid-cols-2">
                <Field>
                    <FieldLabel htmlFor="cargo">Cargo que você busca</FieldLabel>
                    <Input id="cargo" name="cargo" placeholder="Ex.: Desenvolvedor Front-end Júnior" />
                    <FieldDescription>Opcional</FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor="empresa">Empresa que você quer</FieldLabel>
                    <Input id="empresa" name="empresa" placeholder="Ex.: Nubank" />
                    <FieldDescription>Opcional, deixa a análise mais certeira</FieldDescription>
                </Field>
            </div>

            {erro && (
                <p role="alert" className="text-sm text-destructive">
                    {erro}
                </p>
            )}

            <button
                type="submit"
                disabled={enviando || !arquivo}
                className="flex h-12 w-full items-center justify-center rounded-lg bg-[#0b1437] text-sm font-medium text-white outline-none transition-colors hover:bg-[#13265e] focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 hover:cursor-pointer"
            >
                {enviando ? "Enviando seu currículo..." : "Analisar meu currículo"}
            </button>
        </form>
    )
}

export default Upload
