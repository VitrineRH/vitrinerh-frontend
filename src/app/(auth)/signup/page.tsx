"use client"

import { SignupForm } from "@/app/(auth)/signup/_components/signup-form"
import { GalleryVerticalEndIcon } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="relative z-10 flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          VitrineRH
        </a>
        <SignupForm />
      </div>
    </div>
  )
}
