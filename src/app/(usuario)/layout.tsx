import { Sidebar } from "@/components/layout/Sidebar";

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* A sua Sidebar fica fixa no lado esquerdo */}
      <Sidebar/>
      
      {/* O conteúdo das telas renderiza ao lado da Sidebar */}
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
}