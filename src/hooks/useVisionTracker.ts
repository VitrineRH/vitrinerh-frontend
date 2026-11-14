"use client"

import React, { useEffect, useRef, useState } from "react"
import type {
 FaceLandmarkerResult,
 PoseLandmarkerResult,
 GestureRecognizerResult
} from "@mediapipe/tasks-vision"

import type { FromWorker, ToWorker } from "@/workers/vision.worker"

// limite de ritmo: no máximo ~12 análises por segundo
// (o vídeo continua a 30 fps; isso só controla quantas vezes o modelo roda)
const ANALYSIS_INTERVAL_MS = 1000 / 12

export type VisionStatus = 'loading' | 'ready' | 'error'

export type VisionResult = {
    face: FaceLandmarkerResult | null
    pose: PoseLandmarkerResult | null
    gesture: GestureRecognizerResult | null
}


const useVisionTracker = () => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const resultRef = useRef<VisionResult>({ face: null, pose: null, gesture: null })
    const [status, setStatus] = useState<VisionStatus>('loading')
    const [fps, setFps] = useState<number>(0)

    useEffect(() => {
        let cancelado = false
        let rafId = 0
        let stream: MediaStream | null = null

        let busy = false
        let lastSent = 0
        let lastVideoTime = -1
        let fpsFrames = 0
        let fpsStart = performance.now()

        const worker = new Worker (
            new URL("../workers/vision.worker.ts", import.meta.url),
            { type: "module" }
        )
        const send = (msg: ToWorker, transfer: Transferable[] = []) => 
            worker.postMessage(msg, transfer)

        // o loop so tira foto e manda
        const loop = () => {
            rafId = requestAnimationFrame(loop)

            // aba escondida: não analisa nada
            if (document.hidden) return

            const video = videoRef.current
            if (!video || busy) return

            // limite de ritmo: espera dar o intervalo desde o último envio
            const now = performance.now()
            if (now - lastSent < ANALYSIS_INTERVAL_MS) return

            // só roda o modelo quando chega um frame novo da camera rs
            if(video.readyState < 2 || video.currentTime === lastVideoTime) return

            lastVideoTime = video.currentTime
            lastSent = now
            busy = true

            createImageBitmap(video)
            .then((bitmap) => {
                if (cancelado) {
                    bitmap.close()
                    return
                }
                send({ type: "frame", bitmap, timestamp: performance.now() }, [bitmap])
            })
            .catch(() => {
                busy = false
            })
        }

        const startCamera = async () => {
            try {
                const media = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'user',
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        frameRate: { ideal: 30, max: 30 }
                    },
                    audio: true
                })
                if (cancelado) {
                    media.getTracks().forEach((track) => track.stop())
                    return
                }
                stream = media

                const video = videoRef.current
                if (!video) return
                video.srcObject = media
                await video.play()
                
                setStatus('ready')
                rafId = requestAnimationFrame(loop)
            } catch (error) {
                console.error("[vision]", error)
                if (!cancelado) setStatus('error')
            }
        }
        worker.onmessage = (event: MessageEvent<FromWorker>) => {
        const msg = event.data

        if (msg.type === "ready") {
            startCamera()
            return
        }

        if (msg.type === "error") {
            console.error("[vision worker]", msg.message)
            setStatus('error')
            return
        }

        // type === "result"
        busy = false
        resultRef.current.face = msg.face
        if (msg.pose) resultRef.current.pose = msg.pose
        if (msg.gesture ) resultRef.current.gesture = msg.gesture

        const now = performance.now()
        fpsFrames++
        if (now - fpsStart >= 1000) {
            setFps(Math.round((fpsFrames * 1000) / (now - fpsStart)))
            fpsFrames = 0
            fpsStart = now

            const g = resultRef.current.gesture?.gestures[0]?.[0]
            console.log(
                "[vision] rosto", msg.faceMs.toFixed(1),
                "| extra", msg.extraMs.toFixed(1), "ms",
                "| ombros", resultRef.current.pose?.landmarks[0] ? "ok" : "null",
                "| gesto", g ? `${g.categoryName} (${g.score.toFixed(2)})` : "null"
            )
        }
    }

    send({ type: "init" })

    return () => {
        cancelado = true
        cancelAnimationFrame(rafId)
        stream?.getTracks().forEach((t) => t.stop())
        worker.terminate() // mata o worker e libera a porra toda junta
        }
    }, [])

    return { videoRef, resultRef, status, fps }
}

export default useVisionTracker