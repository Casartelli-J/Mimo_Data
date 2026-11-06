import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, ExternalLink, CircleCheck, Clock3 } from 'lucide-react';
import { Header } from '@/components/Header';
import { FormEditor } from '@/components/FormEditor';
import { ResponsesTable } from '@/components/ResponsesTable';
import { isConfigured, supabaseServer } from '@/lib/supabase/server';
import type { Business, FormRecord, Submission } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function FormPage({params}: {params:Promise<{id:string}>}) {
  if(!isConfigured()) redirect('/login');
  const {id} = await params;
  const supabase = await supabaseServer();
  const {data:{user}} = await supabase.auth.getUser(); if(!user) redirect('/login');
  const {data:record} = await supabase.from('forms').select('*').eq('id',id).maybeSingle(); if(!record) notFound();
  const form = record as FormRecord;
  const {data:company} = await supabase.from('businesses').select('*').eq('id',form.business_id).eq('owner_id',user.id).maybeSingle(); if(!company) notFound();
  const business=company as Business;
  const {data:responses} = await supabase.from('submissions').select('*').eq('form_id',form.id).order('created_at',{ascending:false}).limit(200);
  const rows = (responses||[]) as Submission[];
  return <><Header dashboard/><main className="site-shell py-10 sm:py-14">
    <Link href={`/dashboard/empresa/${business.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#4e7960] hover:underline mb-7"><ArrowLeft size={16}/> Voltar para {business.name}</Link>
    <div className="flex items-start justify-between gap-4 flex-wrap mb-9"><div><span className="kicker">FORMULÁRIO</span><h1 className="display text-4xl sm:text-5xl mt-2">{form.title}</h1><div className="mt-4 flex gap-3 items-center"><span className={`status-chip ${form.published?'bg-[#e3f5e7] text-[#2c734d]':'bg-[#f0f0ed] text-[#657067]'}`}>{form.published?<CircleCheck size={14}/>:<Clock3 size={14}/>} {form.published?'Publicado':'Rascunho'}</span><span className="text-sm text-[#7c8a7e]">{rows.length} resposta(s) recente(s)</span></div></div>{form.published && <Link href={`/f/${form.slug}`} target="_blank" className="button-secondary text-sm"><ExternalLink size={16}/> Ver formulário</Link>}</div>
    <div className="grid lg:grid-cols-[.88fr_1.12fr] gap-6 items-start"><div><h2 className="font-bold text-xl mb-4">Editar formulário</h2><FormEditor businessId={business.id} businessName={business.name} initial={form}/></div><div><h2 className="font-bold text-xl mb-4">Gerenciar contatos</h2><ResponsesTable rows={rows} fields={form.fields}/></div></div>
  </main></>;
}
