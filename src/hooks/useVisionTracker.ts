"use client"

import React, { useEffect, useRef, useState } from "react"
import {
    FaceLandmarker,
    PoseLandmarker,
    GestureRecognizer,
    FilesetResolver,
    type FaceLandmarkerResult,
    type PoseLandmarkerResult,
    type GestureRecognizerResult
} from "@mediapipe/tasks-vision"


const wasm_url = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.3/wasm"
const face_model_url = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
const pose_model_url = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task"
const gesture_model_url = "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task"

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
        let face: FaceLandmarker | null = null
        let pose: PoseLandmarker | null = null
        let gesture: GestureRecognizer | null = null

        let frame = 0
        let poseMs = 0
        let handMs = 0
        let lastVideoTime = -1
        let fpsFrames = 0
        let fpsStart = performance.now()

        const loop = () => {
            const video = videoRef.current
            if (!video || !face || !pose || !gesture) return
            
            // só roda o modelo quando chega um frame novo da camera rs
            if (video.readyState >= 2 && video.currentTime !== lastVideoTime) {
                lastVideoTime = video.currentTime
                const now = performance.now()

                // rosto: todo frame
                const t0 = performance.now()
                resultRef.current.face = face.detectForVideo(video, now)
                const t1 = performance.now()
                const faceMs = t1 - t0

                //trabalhar com rodizio para facilitar rodizio: par = pose, impar = mãos
                if (frame % 2 === 0) {
                    resultRef.current.pose = pose.detectForVideo(video, now)
                    poseMs = performance.now() - t1
                } else {
                    resultRef.current.gesture = gesture.recognizeForVideo(video, now)
                    handMs = performance.now() - t1
                }
                frame++

                //contador de FPS: atualiza o state só 1x por segundo
                fpsFrames++
                if (now - fpsStart >= 1000) {
                    setFps(Math.round((fpsFrames * 1000) / (now - fpsStart)))
                    fpsFrames = 0
                    fpsStart = now

                    const g = resultRef.current.gesture?.gestures[0]?.[0]
                    console.log(
                        "[vision] rosto", faceMs.toFixed(1),
                        "| pose", poseMs.toFixed(1),
                        "| mão", handMs.toFixed(1), "ms",
                        "| ombros", resultRef.current.pose?.landmarks[0] ? "ok" : "null",
                        "| gesto", g ? `${g.categoryName} (${g.score.toFixed(2)})` : "null"
                    )
                }
            }
            rafId = requestAnimationFrame(loop)
        }
        const start = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(wasm_url)

                //carregar os 3
                const [f,p,g] = await Promise.all([
                    FaceLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: face_model_url,
                        delegate: "GPU"
                    },
                    runningMode: 'VIDEO',
                    numFaces: 1,
                    outputFaceBlendshapes: true
                }),
                PoseLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: pose_model_url,
                        delegate: "GPU"
                    },
                    numPoses: 1,
                    runningMode: 'VIDEO'
                }),
                GestureRecognizer.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: gesture_model_url,
                        delegate: "GPU"
                    },
                    numHands: 1,
                    runningMode: 'VIDEO'
                }),
            ])
                if (cancelado) {
                    f.close();
                    p.close();
                    g.close();
                    return
                }
                face = f
                pose = p
                gesture = g

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
        start()

        return () => {
            cancelado = true
            cancelAnimationFrame(rafId)
            stream?.getTracks().forEach((t) => t.stop())
            face?.close()
            pose?.close()
            gesture?.close()
        }
    }, [])

    return { videoRef, resultRef, status, fps }
}

export default useVisionTracker