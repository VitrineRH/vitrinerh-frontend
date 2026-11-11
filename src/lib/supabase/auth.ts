import { cache } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "./server";

// Valida a sessão no Supabase e evita repetir a chamada dentro do mesmo request.
export const getCurrentUser = cache(async () => {
  // O Supabase usa Date.now() para checar a sessão; isso só pode rodar na hora do pedido.
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  return user;
});
