import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ".././globals.css";
import Header from "./_components/header";

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
      <body suppressHydrationWarning>
        <Header/>
        {children}
        </body>
    </html>
  );
}
