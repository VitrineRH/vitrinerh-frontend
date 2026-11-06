"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  Home, FileText, Briefcase, Bot, GraduationCap, Users, Calendar,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type NavLink = { name: string; href: string; icon: LucideIcon };

const grupos: { titulo: string; links: NavLink[] }[] = [
  {
    titulo: "Principal",
    links: [
      { name: "Home", href: "/home", icon: Home },
      { name: "Análise de currículo", href: "/analise-curriculo", icon: FileText },
      { name: "Vagas", href: "/vagas", icon: Briefcase },
    ],
  },
  {
    titulo: "Carreira",
    links: [
      { name: "Entrevista com IA", href: "/entrevista-ia", icon: Bot },
      { name: "Trilha de Cursos", href: "/cursos", icon: GraduationCap },
      { name: "Mentores de RH", href: "/mentores-rh", icon: Users },
      { name: "Agenda", href: "/agenda", icon: Calendar },
    ],
  },
];

export function Sidebar({ perfil, children }: { perfil: ReactNode; children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar perfil={perfil} />
      <SidebarInset className="bg-[#f1f5f9]">
        <header className="flex items-center gap-2 p-4 m-6 md:hidden">
          <SidebarTrigger />
          <span className="font-semibold">VitrineRH</span>
        </header>
        <div className="flex-1 px-4 py-6 md:px-10 md:py-9">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function AppSidebar({ perfil }: { perfil: ReactNode }) {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  return (
    <SidebarRoot collapsible="icon" variant="floating">
      <SidebarHeader
        className={cn(
          "flex md:pt-3.5",
          isCollapsed ? "flex-col items-center gap-4" : "flex-row items-center justify-between"
        )}
      >
        <Link href="/home" className="flex items-center gap-3">
          <Image width={20} height={20} src="/logo.png" alt="VitrineRH Logo" />
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-gray-900 text-lg leading-tight">VitrineRH</h1>
              <p className="text-xs text-gray-500">Área do candidato</p>
            </div>
          )}
        </Link>

        <motion.div
          key={isCollapsed ? "collapsed" : "expanded"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <SidebarTrigger />
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="gap-4 px-2 py-4">
        {grupos.map((grupo) => (
          <SidebarGroup key={grupo.titulo}>
            <SidebarGroupLabel className="uppercase tracking-wider font-bold">
              {grupo.titulo}
            </SidebarGroupLabel>
            <SidebarMenu>
              {grupo.links.map(({ name, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(href)}
                    tooltip={name}
                    className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 data-active:bg-slate-900 data-active:text-white data-active:hover:bg-slate-900 data-active:hover:text-white"
                    render={<Link href={href} />}
                  >
                    <Icon className="size-4" />
                    <span className="font-medium">{name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className={cn("px-2", isCollapsed && "hidden")}>
        {perfil}
        <hr className="border-gray-200 mb-2" />
        <div className="text-[11px] text-gray-400 space-y-1 px-2">
          <p className="pt-2 text-xs">VitrineRH 2026 © Todos os direitos reservados</p>
        </div>
      </SidebarFooter>
    </SidebarRoot>
  );
}
