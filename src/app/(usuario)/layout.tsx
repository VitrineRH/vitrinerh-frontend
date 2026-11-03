import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ".././globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/pages/footer";
import { Sidebar } from "@/components/layout/Sidebar";
import type { Metadata } from "next";
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
      <body suppressHydrationWarning>
      <ThemeProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
       className="flex min-h-screen"
      >
      <Sidebar/>
      <main className="flex-1 p-8 bg-gray-50">
        {children}
       </main>
        <Footer/>
      </ThemeProvider>
        </body>
    </html>
  );
}

