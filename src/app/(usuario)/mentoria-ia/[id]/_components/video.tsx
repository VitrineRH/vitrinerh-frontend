"use client"

import useVisionTracker from "@/hooks/useVisionTracker"
import React, { useRef, useEffect, useState } from "react"


const Video = () => {

    const { videoRef, status, fps} = useVisionTracker()

    return (
        <>
        <div className="relative w-full mx-auto max-w-2xl">
            <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="block w-full "
            />
            <div className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-1 font-mono text-xs text-white">
            {status} e {fps} fps

            </div>
        </div>
        </>
    )
}

export default Video