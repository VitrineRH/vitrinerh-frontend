import { Suspense } from "react";
import { getCurrentUser } from "@/lib/supabase/auth";

async function Saudacao() {
  const user = await getCurrentUser();
  const nome = user.user_metadata.full_name || user.email;

  return <h1 className="text-2xl font-bold text-gray-900">Olá, {nome}!</h1>;
}

export default function HomePage() {
  return (
    <section className="flex flex-col gap-2">
      <Suspense fallback={<div className="h-8 w-64 rounded-md bg-gray-200 animate-pulse" />}>
        <Saudacao />
      </Suspense>
      <p className="text-gray-600">Bem-vindo à sua área do candidato na VitrineRH.</p>
    </section>
  );
}
