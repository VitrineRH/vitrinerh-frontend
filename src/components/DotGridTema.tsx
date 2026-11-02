"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import DotGrid from "@/components/DotGrid"

export default function DotGridTema() {
  const { resolvedTheme } = useTheme()
  const [montado, setMontado] = useState(false)

  useEffect(() => setMontado(true), [])
  if (!montado) return null // evita piscar a cor errada no primeiro render

  const escuro = resolvedTheme === "dark"

  return (
    <DotGrid
      baseColor={escuro ? "#0a0a0a" : "#ffffff"}
      activeColor="#2563EB"
      shape="circle"
      dotSize={5}
      gap={18}
        proximity={140}
        strength={1}
        bounce={0.6}
        tension={0.4}
        returnDuration={0.8}
        shockRadius={320}
        shockStrength={5}
        swell={0.8}
        stretch={0.5}
        glow={0.5}
        fade={0}
        intro
        opacity={1}
        mouseInteraction
        clickShock
    />
  )
}