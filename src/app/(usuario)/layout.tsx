import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/layout/footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { PerfilUsuario } from "@/components/layout/PerfilUsuario";
import "@/app/globals.css";
import VLibras from "@/components/accessibility/VLibras";

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
  description: "Prepare-se para o mercado de trabalho com análise de currículo, compatibilidade com vagas, simulação de entrevistas com IA, cursos e mentoria de profissionais de RH.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-br"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scrollbar-none [&::-webkit-scrollbar]:hidden`}
    >
      <body suppressHydrationWarning className="flex min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <VLibras />
          <Sidebar
            perfil={
              <Suspense fallback={<div className="h-12 mb-4 rounded-md bg-gray-100 animate-pulse" />}>
                <PerfilUsuario />
              </Suspense>
            }
          >
            {children}
          </Sidebar>
        </ThemeProvider>
      </body>
    </html>
  );
}
