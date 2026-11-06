import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const url = () => process.env.NEXT_PUBLIC_SUPABASE_URL!;
const publicKey = () => process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(url(), publicKey(), {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(items) {
        try { items.forEach(({name, value, options}) => cookieStore.set(name, value, options)); }
        catch { /* Server Components não conseguem escrever cookies: middleware.ts renova a sessão. */ }
      },
    },
  });
}

// Somente leitura pública respeitando RLS. Não contém credenciais privilegiadas.
export function supabasePublic() {
  return createClient(url(), publicKey(), {auth: {autoRefreshToken: false, persistSession: false}});
}

// Exclusivamente para a rota de recebimento de respostas após validação.
export function supabaseAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY ausente no servidor.');
  return createClient(url(), key, {auth: {autoRefreshToken: false, persistSession: false}});
}
