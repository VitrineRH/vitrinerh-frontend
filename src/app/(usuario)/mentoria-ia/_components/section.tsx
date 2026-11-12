"use client"


import { Orb } from "@/components/bots/orb"
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"
import { error } from "console"
import React, { useRef, useEffect, useState } from "react"

const corpoCard = 
    "bg-gray-50 relative group/card hover:cursor-pointer dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-full rounded-xl p-4 border"

const Sessao = () => {

    const videoRef = useRef<HTMLVideoElement>(null)
    const [aceitou, setAceitou] = useState(false)
    const [foco, setFoco] = useState("")

    useEffect(() => {
        const steamPromise = navigator.mediaDevices.getUserMedia({video: {
            facingMode: "user", //enviroment ou trueeeeee ne
            width: 1200,
            height: 1000,
            frameRate: { ideal: 30, max: 30}
        }})

        steamPromise
        .then((stream) => {
            if (videoRef.current) videoRef.current.srcObject = stream
        })
        .catch((error) => {
            console.error("não consegui encontrar sua webcam", error)
        })

        return () => {
            steamPromise.then((stream) => stream.getTracks().forEach((track) => track.stop())).catch(() => {}) 
        }
    }, [])

    return (
        <section className="grid grid-cols-2 gap-4">
            <div>
                <Orb state="idle"  />
                <div className="flex flex-col gap-2">
                    <label htmlFor="foco" className="text-sm font-medium text-foreground"> Foco da entrevista </label>
                    <p className="text-sm text-muted-foreground"> Opcional. Diga onde quer ser mais testado e o Orbe ajusta as perguntas. </p>
                    <div className="relative">
                        <textarea
                        id="foco"
                        value={foco}
                        onChange={(e) =>
                            setFoco(e.target.value)
                        }
                        maxLength={300}
                        rows={4}
                        placeholder="Ex.: vaga de analista de dados júnior, quero treinar perguntas sobre SQL e como explicar meus projetos da faculdade"
                        className="w-full resize-none rounded-xl border border-border bg-muted/40 px-4 pt-3 pb-8 text-sm leading-6 text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-blue-600/60 focus:bg-background focus:ring-4 focus:ring-blue-600/10 dark:focus:border-sky-300/50 dark:focus:ring-sky-300/10"
                        />
                        <span className="pointer-events-none absolute right-4 bottom-3 text-xs tabular-nums text-muted-foreground"> {foco.length}/300 </span>
                    </div>
                </div>
            </div>
            <div className="pt-10">
                <CardContainer intensidade={0.4} containerClassName="py-0 items-stretch" className="h-full w-full items-stretch">
                    <CardBody className={corpoCard}>
                        <CardItem translateZ="5" as="h2" className="text-2xl font-light ">
                            Antes de começar
                        </CardItem>
                        <CardItem translateZ="10" className="w-full mt-2">
                            <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="block w-full rounded-4xl object-cover h-full py-4"
                            ></video>
                        </CardItem>
                        <CardItem translateZ="0" className="flex items-center gap-2 py-4 hover:cursor-pointer">
                            <input type="checkbox"
                            checked={aceitou}
                            onChange={(e) => 
                                setAceitou(e.target.checked)
                            }
                            className="size-4 accent-blue-600" />

                            <span className="text-sm text-muted-foreground"> Entendo que o Orbe observa meus padrões comportamentais em tempo real para dar dicas, sem gravar video ou Imagem</span>
                        </CardItem>
                        <CardItem>
                            <button className="border border-foreground/40 rounded-3xl text-sm font-light px-3 py-4 hover:cursor-pointer">
                                Iniciar entrevista
                            </button>
                        </CardItem>
                    </CardBody>
                </CardContainer>
            </div> 
        </section>
    )
}

export default Sessao