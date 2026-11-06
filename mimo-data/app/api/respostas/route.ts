import { NextRequest, NextResponse } from 'next/server';
import { submissionSchema, validateAnswers } from '@/lib/schemas';
import { isConfigured, supabaseAdmin, supabasePublic } from '@/lib/supabase/server';
import type { FormField } from '@/lib/types';

export async function POST(req: NextRequest) {
  if (!isConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Serviço de cadastro ainda não configurado.' }, { status: 503 });
  }
  try {
    // Pequeno limite preventivo; para produção adicionar rate-limit compartilhado e CAPTCHA.
    const raw = await req.text();
    if (raw.length > 15000) return NextResponse.json({ error: 'Requisição muito grande.' }, { status: 413 });
    const parsed = submissionSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return NextResponse.json({ error: 'Dados inválidos ou autorização de privacidade ausente.' }, { status: 400 });
    const input = parsed.data;
    // Campo invisível: robôs que o preenchem não criam registros.
    if (input.website.trim()) return NextResponse.json({ ok: true }, { status: 201 });
    const { data: form, error: findError } = await supabasePublic().from('forms')
      .select('id,fields,published').eq('id', input.form_id).eq('published', true).maybeSingle();
    if (findError || !form) return NextResponse.json({ error: 'Formulário indisponível.' }, { status: 404 });
    const fields = form.fields as FormField[];
    const invalid = validateAnswers(fields, input.answers);
    if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });
    const sanitized = Object.fromEntries(fields.map((field) => [field.key, (input.answers[field.key] ?? '').trim()]));
    const { error } = await supabaseAdmin().from('submissions').insert({
      form_id: input.form_id,
      answers: sanitized,
      privacy_accepted: true,
      marketing_opt_in: input.marketing_opt_in,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Não foi possível enviar o formulário.' }, { status: 500 });
  }
}
