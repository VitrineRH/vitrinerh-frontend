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

export type ToWorker =
    | { type: "init" }
    | { type: "frame"; bitmap: ImageBitmap; timestamp: number }

//mensagens que o workrt manda pra pagina 

export type FromWorker = 
    | { type: "ready" }
    | { type: "error"; message: string}
    | {
        type: "result"
        face: FaceLandmarkerResult
        pose: PoseLandmarkerResult | null
        gesture: GestureRecognizerResult | null
        faceMs: number
        extraMs: number
    }

    const send = (msg: FromWorker ) => self.postMessage(msg)

    let face: FaceLandmarker | null = null
    let pose: PoseLandmarker | null = null
    let gesture: GestureRecognizer | null = null
    let frame = 0

    const init = async () => {
        try {
            const vision = await FilesetResolver.forVisionTasks(wasm_url)

            // carrega os 3 em paralelo: no worker isso não trava a page
            const [f, p, g] = await Promise.all([
                FaceLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: face_model_url,
                        delegate: "CPU"
                    },
                    runningMode: "VIDEO",
                    numFaces: 1,
                    outputFaceBlendshapes: true
                }),
                PoseLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: pose_model_url,
                        delegate: "CPU"
                    },
                    runningMode: "VIDEO",
                    numPoses: 1
                }),
                GestureRecognizer.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: gesture_model_url,
                        delegate: "CPU"
                    },
                    runningMode: "VIDEO",
                    numHands: 1
                }),
            ])
            face = f
            pose = p
            gesture = g

            send ({ type: "ready" })
        } catch (error) {
            send({ type: "error", message: String(error)})
        }
    }

    const processFrame = (bitmap: ImageBitmap, timestamp: number ) => {
        if(!face || !pose || !gesture) {
            bitmap.close()
            return
        }

        const t0 = performance.now()
        const faceResult = face.detectForVideo(bitmap, timestamp)
        const t1 = performance.now()

        //rodizio para diminuir latencia rodizio: par =pose impar = mao
        let poseResult: PoseLandmarkerResult | null = null
        let gestureResult: GestureRecognizerResult | null = null
        if (frame % 2 === 0) {
            poseResult = pose.detectForVideo(bitmap, timestamp)
        } else {
            gestureResult = gesture.recognizeForVideo(bitmap, timestamp)
        }
        const t2 = performance.now()
        frame++

        bitmap.close() //libera a memoria da "foto" frame sla

        send({
            type: "result",
            face: faceResult,
            pose: poseResult,
            gesture: gestureResult,
            faceMs: t1 - t0,
            extraMs: t2 - t1,
        })
    }
    self.onmessage = (event: MessageEvent<ToWorker>) => {
        const msg = event.data
        if (msg.type === "init") init()
        if (msg.type === "frame") processFrame(msg.bitmap, msg.timestamp)
    }