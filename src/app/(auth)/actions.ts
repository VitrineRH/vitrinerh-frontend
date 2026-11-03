"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
  message?: string;
  name?: string;
  email?: string;
};

const MENSAGENS_DE_ERRO: Record<string, string> = {
  invalid_credentials: "E-mail ou senha incorretos.",
  email_not_confirmed: "Confirme seu e-mail antes de entrar.",
  user_already_exists: "Já existe uma conta com este e-mail.",
  email_exists: "Já existe uma conta com este e-mail.",
  weak_password: "Escolha uma senha mais forte.",
  over_email_send_rate_limit: "Muitas tentativas. Aguarde um pouco e tente de novo.",
  over_request_rate_limit: "Muitas tentativas. Aguarde um pouco e tente de novo.",
};

function traduzirErro(code?: string) {
  return (
    (code && MENSAGENS_DE_ERRO[code]) ||
    "Não foi possível concluir agora. Tente novamente."
  );
}

const texto = (formData: FormData, campo: string) =>
  String(formData.get(campo) ?? "");

export async function login(
  _state: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = texto(formData, "email").trim();
  const password = texto(formData, "password");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: traduzirErro(error.code), email };

  redirect("/home");
}

export async function signup(
  _state: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = texto(formData, "name").trim();
  const email = texto(formData, "email").trim();
  const password = texto(formData, "password");

  if (password.length < 8) {
    return { error: "A senha precisa ter pelo menos 8 caracteres.", name, email };
  }
  if (password !== texto(formData, "confirm-password")) {
    return { error: "As senhas não coincidem.", name, email };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });

  if (error) return { error: traduzirErro(error.code), name, email };

  // Sem sessão significa que a confirmação de e-mail está ativa no Supabase.
  if (!data.session) {
    return { message: "Conta criada! Confirme seu e-mail para entrar." };
  }

  redirect("/home");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth");
}
