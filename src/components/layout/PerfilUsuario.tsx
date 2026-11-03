import { LogOut } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { getCurrentUser } from "@/lib/supabase/auth";

export async function PerfilUsuario() {
  const user = await getCurrentUser();
  const nome: string = user.user_metadata.full_name || "Usuário";

  return (
    <div className="flex items-center justify-between gap-2 p-2 mb-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
          {nome.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{nome}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
      </div>
      <form action={logout}>
        <button
          type="submit"
          aria-label="Sair"
          title="Sair"
          className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-900 hover:cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
