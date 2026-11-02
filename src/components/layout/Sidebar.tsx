/*
O nome das pastas para os links de navegação são:
- /home
- /analise-curriculo
- /vagas

- /entrevista-ia
- /cursos
- /mentores-rh
- /agenda 

- /privacidade
- /sobre
- /termos
- /contato
*/


"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, FileText, Briefcase, Bot, GraduationCap, Users, Calendar, ChevronsUpDown } from "lucide-react";

export function Sidebar()
{
  const pathname = usePathname();
  const principalLinks =
  [
    { name: "Home", href: "/home", icon: Home },
    { name: "Análise de currículo", href: "/analise-curriculo", icon: FileText },
    { name: "Vagas", href: "/vagas", icon: Briefcase },
  ];
  const carreiraLinks = [
    { name: "Entrevista com IA", href: "/entrevista-ia", icon: Bot },
    { name: "Trilha de Cursos", href: "/cursos", icon: GraduationCap },
    { name: "Mentores de RH", href: "/mentores-rh", icon: Users },
    { name: "Agenda", href: "/agenda", icon: Calendar },
  ];

  return (
    <div className="px-4 py-6 w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between overflow-y-auto">
      {/* Bloco Superior: Header e Nav */}
      <div>
        {/* Cabeçalho da Sidebar */}
        <header className="p-6 flex items-center gap-3">
            <Image width={20} height={20} src="/logo.png" alt="VitrineRH Logo"/>
            <div>
              <h1 className="font-bold text-gray-900 text-lg leading-tight">VitrineRH</h1>
              <p className="text-xs text-gray-500">Área do candidato</p>
            </div>
        </header>
        
        <nav className="flex flex-col gap-8 mt-6">
          {/* Seção Principal */}
          <section>
            <h2 className="text-xs font-bold text-gray-600 mb-3 px-3 uppercase tracking-wider">Principal</h2>
            <ul className="space-y-1">
              {principalLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-slate-900 text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <h2 className="text-xs font-bold text-gray-600 mb-3 px-3 uppercase tracking-wider">Carreira</h2>
            <ul className="space-y-1">
              {carreiraLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                
                return (
                  <li key={link.name}>
                    <Link href={link.href}
                      className=
                        {`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${ isActive ? "bg-slate-900 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900" }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </nav>
      </div>
        
        {/* Rodapé da Sidebar */}
        <footer className="p-4 border-t border-gray-200 mt-6">
          {/* Perfil do Usuário */}
          <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                U
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Usuario</p>
                <p className="text-xs text-gray-500">m@example.com</p>
              </div>
            </div>
            <ChevronsUpDown className="w-4 h-4 text-gray-400" />
          </div>

          <hr className="border-gray-200 mb-4" />

          {/* Links de Rodapé */}
          <div className="text-[11px] text-gray-400 space-y-1">
            <Link href="/privacidade" className="block hover:text-gray-600">Políticas de privacidade</Link>
            <Link href="/sobre" className="block hover:text-gray-600">Sobre</Link>
            <Link href="/termos" className="block hover:text-gray-600">Termos de Uso</Link>
            <Link href="/contato" className="block hover:text-gray-600">Contato</Link>
            <p className="pt-2 text-xs">VitrineRH 2026 © Todos os direitos reservados</p>
          </div>
        </footer>
    </div>
  );
}