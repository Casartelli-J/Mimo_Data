import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PublicForm } from '@/components/PublicForm';
import { isConfigured, supabaseAdmin, supabasePublic } from '@/lib/supabase/server';
import type { FormRecord } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function PublicPage({params}:{params:Promise<{slug:string}>}) {
  if (!isConfigured()) return <main className="min-h-screen flex flex-col gap-4 items-center justify-center p-5 text-center"><h1 className="display text-4xl">Formulário ainda não conectado</h1><p>Configure o Supabase para ativar os formulários públicos.</p><Link className="button-primary" href="/demo">Abrir demonstração</Link></main>;
  const {slug} = await params;

  let formData: FormRecord | null = null;
  let whatsapp: string | null = null;

  try {
    const admin = supabaseAdmin();
    const { data } = await admin.from('forms').select('id,title,brand_name,description,theme,fields,business_id,published').eq('slug', slug).eq('published', true).maybeSingle();
    if (data) {
      formData = data as FormRecord;
      const { data: business } = await admin.from('businesses').select('whatsapp').eq('id', data.business_id).maybeSingle();
      whatsapp = business?.whatsapp || null;
    }
  } catch {
    const { data } = await supabasePublic().from('forms').select('id,title,brand_name,description,theme,fields').eq('slug',slug).eq('published',true).maybeSingle();
    if (data) formData = data as FormRecord;
  }

  if(!formData) notFound();
  return <main className="py-8 sm:py-12 px-4"><div className="max-w-[980px] mx-auto"><PublicForm form={formData} businessWhatsapp={whatsapp} /><div className="text-center text-xs text-[#8f9b8e] mt-7">Formulário criado com Mimo Data</div></div></main>;
}
