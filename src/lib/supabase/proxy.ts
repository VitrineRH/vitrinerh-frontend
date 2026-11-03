import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROTAS_PROTEGIDAS = [
  "/home",
  "/analise-curriculo",
  "/vagas",
  "/entrevista-ia",
  "/cursos",
  "/mentores-rh",
  "/agenda",
];
const ROTAS_DE_AUTH = ["/auth", "/signup"];

const corresponde = (pathname: string, rotas: string[]) =>
  rotas.some((rota) => pathname === rota || pathname.startsWith(`${rota}/`));

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Também renova o token expirado, por isso precisa rodar em toda requisição.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  let destino: string | null = null;
  if (!user && corresponde(pathname, ROTAS_PROTEGIDAS)) destino = "/auth";
  if (user && corresponde(pathname, ROTAS_DE_AUTH)) destino = "/home";

  if (!destino) return response;

  const redirecionamento = NextResponse.redirect(new URL(destino, request.url));
  response.cookies
    .getAll()
    .forEach((cookie) => redirecionamento.cookies.set(cookie));
  return redirecionamento;
}
