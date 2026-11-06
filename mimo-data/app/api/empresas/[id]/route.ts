import { NextRequest, NextResponse } from 'next/server';
import { newBusinessSchema } from '@/lib/schemas';
import { isConfigured, supabaseServer } from '@/lib/supabase/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isConfigured()) return NextResponse.json({ error: 'Configure o Supabase.' }, { status: 503 });
  try {
    const { id } = await params;
    const input = newBusinessSchema.safeParse(await req.json());
    if (!input.success) return NextResponse.json({ error: 'Informe nome e WhatsApp válidos para a empresa.' }, { status: 400 });
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Entre na sua conta.' }, { status: 401 });

    const { data: owned } = await supabase.from('businesses').select('id').eq('id', id).eq('owner_id', user.id).maybeSingle();
    if (!owned) return NextResponse.json({ error: 'Empresa não encontrada.' }, { status: 404 });

    const { data, error } = await supabase.from('businesses')
      .update({ name: input.data.name, whatsapp: input.data.whatsapp })
      .eq('id', id)
      .eq('owner_id', user.id)
      .select('id,name,slug,whatsapp')
      .single();
    if (error) throw error;
    return NextResponse.json({ business: data });
  } catch {
    return NextResponse.json({ error: 'Não foi possível atualizar a empresa.' }, { status: 500 });
  }
}
