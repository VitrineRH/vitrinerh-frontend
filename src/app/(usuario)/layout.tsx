import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

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
      <body suppressHydrationWarning
       className="flex min-h-screen">
      <ThemeProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      >
     <Sidebar/>
      <main className="flex-1 bg-[#f1f5f9] px-10 py-9">
        {children}
       </main>
      </ThemeProvider>
        </body>
    </html>
  );
}

