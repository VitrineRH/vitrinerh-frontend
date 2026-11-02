import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import DotGridTema from "@/components/DotGridTema";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
        <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        >
        <div className="absolute inset-0 z-0">
          <DotGridTema />
        </div>

        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
