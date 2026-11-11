"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
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
import { SeletorTema } from "./SeletorTema";

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
      <SidebarInset className="bg-background">
        <header className="flex items-center gap-2 p-4 m-6 md:hidden">
          <SidebarTrigger />
          <span className="font-semibold">VitrineRH</span>
        </header>
        <div className="flex-1 px-4 py-6 md:px-10 md:py-9">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function BotaoNav({ link: { name, href, icon: Icon }, ativo }: { link: NavLink; ativo: boolean }) {
  return (
    <SidebarMenuButton
      isActive={ativo}
      tooltip={name}
      className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 data-active:bg-slate-900 data-active:text-white data-active:hover:bg-slate-900 data-active:hover:text-white dark:text-muted-foreground dark:hover:bg-sidebar-accent dark:hover:text-foreground dark:data-active:bg-sidebar-primary dark:data-active:text-sidebar-primary-foreground dark:data-active:hover:bg-sidebar-primary"
      render={<Link href={href} />}
    >
      <Icon className="size-4" />
      <span className="font-medium">{name}</span>
    </SidebarMenuButton>
  );
}

// Em rotas com parâmetro (ex.: /analise-curriculo/[id]) o caminho só existe no
// request, então o usePathname fica isolado aqui dentro de um Suspense.
function ItemNav({ link }: { link: NavLink }) {
  const pathname = usePathname();
  return <BotaoNav link={link} ativo={pathname.startsWith(link.href)} />;
}

function AppSidebar({ perfil }: { perfil: ReactNode }) {
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
              <h1 className="font-bold text-gray-900 text-lg leading-tight dark:text-foreground">VitrineRH</h1>
              <p className="text-xs text-gray-500 dark:text-muted-foreground">Área do candidato</p>
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
              {grupo.links.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <Suspense fallback={<BotaoNav link={link} ativo={false} />}>
                    <ItemNav link={link} />
                  </Suspense>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}

        <SidebarGroup className="mt-auto">
          <SeletorTema recolhido={isCollapsed} />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={cn("px-2", isCollapsed && "hidden")}>
        {perfil}
        <hr className="border-gray-200 mb-2 dark:border-sidebar-border" />
        <div className="text-[11px] text-gray-400 space-y-1 px-2 dark:text-muted-foreground">
          <p className="pt-2 text-xs">VitrineRH 2026 © Todos os direitos reservados</p>
        </div>
      </SidebarFooter>
    </SidebarRoot>
  );
}
