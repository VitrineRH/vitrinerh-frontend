import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import DotGrid from "@/components/DotGrid";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VitrineRH",
  description: "Acesse sua conta na VitrineRH.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-br"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning>
        <div className="absolute inset-0 z-0">
          <DotGrid
            baseColor="#ffffff"
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
          // background rs
          />
        </div>

        {children}
      </body>
    </html>
  );
}
