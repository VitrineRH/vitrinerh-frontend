import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "./server";

// Valida a sessão no Supabase e evita repetir a chamada dentro do mesmo request.
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  return user;
});
