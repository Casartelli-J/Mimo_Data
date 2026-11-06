import { NextRequest, NextResponse } from 'next/server';
import { newBusinessSchema, slugify } from '@/lib/schemas';
import { isConfigured, supabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  if (!isConfigured()) return NextResponse.json({ error: 'Configure o Supabase.' }, { status: 503 });
  try {
    const input = newBusinessSchema.safeParse(await req.json());
    if (!input.success) return NextResponse.json({ error: 'Informe nome e WhatsApp válidos para a empresa.' }, { status: 400 });
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Entre na sua conta.' }, { status: 401 });
    const { data, error } = await supabase.from('businesses').insert({
      name: input.data.name,
      whatsapp: input.data.whatsapp,
      owner_id: user.id,
      slug: `${slugify(input.data.name)}-${crypto.randomUUID().slice(0, 8)}`,
    }).select('id,name,slug,whatsapp').single();
    if (error) throw error;
    return NextResponse.json({ business: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Não foi possível criar a empresa.' }, { status: 500 });
  }
}
