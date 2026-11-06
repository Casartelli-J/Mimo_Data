import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { formSchema } from '@/lib/schemas';
import { isConfigured, supabaseServer } from '@/lib/supabase/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isConfigured()) return NextResponse.json({ error: 'Configure o Supabase.' }, { status: 503 });
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  try {
    const body: unknown = await req.json();
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Entre na sua conta.' }, { status: 401 });
    const { data: form } = await supabase.from('forms').select('id,business_id').eq('id', id).maybeSingle();
    if (!form) return NextResponse.json({ error: 'Formulário não encontrado.' }, { status: 404 });
    const { data: owned } = await supabase.from('businesses').select('id').eq('id', form.business_id).eq('owner_id', user.id).maybeSingle();
    if (!owned) return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    const update = z.object({published: z.boolean()}).safeParse(body);
    const input = formSchema.safeParse({...((body && typeof body === 'object') ? body : {}),business_id:form.business_id});
    if (!update.success || !input.success) return NextResponse.json({ error: 'Confira os campos do formulário.' }, { status: 400 });
    const { data, error } = await supabase.from('forms').update({...input.data, published: update.data.published}).eq('id', id).select('id,slug,published').single();
    if (error) throw error;
    return NextResponse.json({ form: data });
  } catch {
    return NextResponse.json({ error: 'Não foi possível salvar as alterações.' }, { status: 500 });
  }
}
