import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isConfigured, supabaseServer } from '@/lib/supabase/server';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isConfigured()) return NextResponse.json({ error: 'Configure o Supabase.' }, { status: 503 });
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Entre na sua conta.' }, { status: 401 });
  // O RLS do Supabase garante que uma empresa só possa apagar suas próprias respostas.
  const { data, error } = await supabase.from('submissions').delete().eq('id', id).select('id');
  if (error) return NextResponse.json({ error: 'Erro ao remover resposta.' }, { status: 500 });
  if (!data?.length) return NextResponse.json({ error: 'Resposta inexistente ou sem permissão.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
