import { NextRequest, NextResponse } from 'next/server';
import { formSchema, slugify } from '@/lib/schemas';
import { isConfigured, supabaseServer } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  if (!isConfigured()) return NextResponse.json({ error: 'Configure o Supabase.' }, { status: 503 });
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  const businessId = req.nextUrl.searchParams.get('empresa');
  if (!businessId) return NextResponse.json({ error: 'Informe a empresa.' }, { status: 400 });
  const { data: owned } = await supabase.from('businesses').select('id').eq('id', businessId).eq('owner_id', user.id).maybeSingle();
  if (!owned) return NextResponse.json({ error: 'Empresa não encontrada.' }, { status: 404 });
  const { data, error } = await supabase.from('forms').select('id,business_id,slug,title,published,created_at').eq('business_id', businessId).order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: 'Não foi possível consultar formulários.' }, { status: 400 });
  return NextResponse.json({ forms: data }, { headers: { 'Cache-Control': 'private, no-store' } });
}

export async function POST(req: NextRequest) {
  if (!isConfigured()) return NextResponse.json({ error: 'Configure o Supabase.' }, { status: 503 });
  try {
    const parsed = formSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'Confira os campos do formulário.', details: parsed.error.issues.map(x => x.message) }, { status: 400 });
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Entre na sua conta.' }, { status: 401 });
    const { data: business } = await supabase.from('businesses').select('id').eq('id', parsed.data.business_id).eq('owner_id', user.id).maybeSingle();
    if (!business) return NextResponse.json({ error: 'Empresa não encontrada.' }, { status: 403 });
    const { data, error } = await supabase.from('forms').insert({
      ...parsed.data,
      slug: `${slugify(parsed.data.title)}-${crypto.randomUUID().slice(0, 8)}`,
      published: false,
    }).select('id,slug').single();
    if (error) throw error;
    return NextResponse.json({ form: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Não foi possível criar o formulário.' }, { status: 500 });
  }
}
