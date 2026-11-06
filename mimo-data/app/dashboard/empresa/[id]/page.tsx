import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, ClipboardList, CircleCheck, Clock3, MessageCircleMore } from 'lucide-react';
import { Header } from '@/components/Header';
import { FormEditor } from '@/components/FormEditor';
import { BusinessSettings } from '@/components/BusinessSettings';
import { isConfigured, supabaseServer } from '@/lib/supabase/server';
import type { Business, FormRecord } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function BusinessPage({ params }: { params: Promise<{id:string}> }) {
  if (!isConfigured()) redirect('/login');
  const {id} = await params;
  const supabase = await supabaseServer();
  const { data: {user}} = await supabase.auth.getUser(); if(!user) redirect('/login');
  const {data: business} = await supabase.from('businesses').select('*').eq('id',id).eq('owner_id',user.id).maybeSingle();
  if(!business) notFound();
  const company = business as Business;
  const {data: forms} = await supabase.from('forms').select('*').eq('business_id',company.id).order('created_at',{ascending:false});
  const list = (forms || []) as FormRecord[];
  return <><Header dashboard/><main className="site-shell py-10 sm:py-14">
    <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-[#4e7960] hover:underline mb-7"><ArrowLeft size={16}/> Voltar ao painel</Link>
    <span className="kicker block">NEGÓCIO CADASTRADO</span>
    <h1 className="display text-4xl sm:text-5xl mt-2">{company.name}</h1>
    <p className="text-[#7a857b] mt-3 mb-3">Crie formulários personalizados e compartilhe o link com seus clientes.</p>
    <p className="inline-flex items-center gap-2 text-sm text-[#3f6a54] bg-[#edf6ee] px-4 py-2 rounded-full mb-9"><MessageCircleMore size={15}/> WhatsApp cadastrado: <strong>{company.whatsapp || 'não informado ainda'}</strong></p>

    <div className="grid lg:grid-cols-[.85fr_1.15fr] gap-6 items-start">
      <section>
        <h2 className="font-bold text-xl mb-4">Seus formulários <span className="text-[#8aa091]">({list.length})</span></h2>
        {list.length === 0 ? <div className="panel p-8"><ClipboardList size={36} className="text-[#6d9c7b]"/><p className="font-bold mt-4">Nenhum formulário ainda</p><p className="helper mt-2">Use o editor ao lado para criar o primeiro.</p></div> : <div className="space-y-3">{list.map(form=><Link href={`/dashboard/formularios/${form.id}`} key={form.id} className="panel block p-5 hover:border-[#91b99c] transition-colors"><div className="flex justify-between items-start gap-3"><h3 className="font-bold">{form.title}</h3><ArrowUpRight size={17} className="shrink-0 text-[#73937b]"/></div><div className="mt-3 flex flex-wrap items-center gap-2 text-xs"><span className={`status-chip ${form.published?'bg-[#e3f5e7] text-[#2c734d]':'bg-[#f0f0ed] text-[#657067]'}`}>{form.published?<CircleCheck size={13}/>:<Clock3 size={13}/>} {form.published?'Publicado':'Rascunho'}</span><span className="text-[#8d968d]">{new Date(form.created_at).toLocaleDateString('pt-BR')}</span></div></Link>)}</div>}
      </section>
      <section className="space-y-6">
        <div><h2 className="font-bold text-xl mb-4">Novo formulário</h2><FormEditor businessId={company.id} businessName={company.name}/></div>
        <BusinessSettings id={company.id} initialName={company.name} initialWhatsapp={company.whatsapp} />
      </section>
    </div>
  </main></>;
}
