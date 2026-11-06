import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowUpRight, Building2, ClipboardList, Plus, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/Header';
import { CreateBusiness } from '@/components/CreateBusiness';
import { SignOut } from '@/components/SignOut';
import { isConfigured, supabaseServer } from '@/lib/supabase/server';
import type { Business } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  if (!isConfigured()) redirect('/login');
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const {data: businesses} = await supabase.from('businesses').select('*').order('created_at',{ascending:false});
  const list = (businesses || []) as Business[];
  return <><Header dashboard/><main className="site-shell py-10 sm:py-14">
    <div className="flex flex-wrap justify-between items-start gap-3 mb-10"><div><span className="kicker">PAINEL DO EMPREENDEDOR</span><h1 className="display text-4xl sm:text-5xl mt-2">Seus negócios</h1><p className="text-[#728077] mt-3">Gerencie formulários, organize contatos e conheça suas respostas.</p></div><SignOut/></div>
    <div className="grid md:grid-cols-3 gap-4 mb-10">
      <div className="panel p-6"><span className="text-sm text-[#7a877e]">Negócios cadastrados</span><div className="text-4xl font-bold mt-2">{list.length}</div></div>
      <div className="panel p-6 md:col-span-2 flex gap-4 items-center"><span className="w-12 h-12 rounded-xl bg-[#ebf5ec] text-[#2d7855] grid place-items-center"><ShieldCheck size={24}/></span><p className="text-[#647468] text-sm leading-relaxed">Seus negócios são separados por usuário. As respostas dos clientes não são exibidas publicamente.</p></div>
    </div>
    <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-6 items-start">
      <section><h2 className="text-lg font-bold mb-4">Empresas cadastradas</h2>
        {list.length === 0 ? <div className="panel p-10 text-center"><Building2 className="mx-auto text-[#8aaa95]" size={43}/><h3 className="font-bold mt-4 text-xl">Seu primeiro negócio começa aqui</h3><p className="helper mt-2">Cadastre uma empresa ao lado para criar um formulário.</p></div> : <div className="space-y-3">{list.map(company=><Link key={company.id} href={`/dashboard/empresa/${company.id}`} className="panel flex items-center p-5 gap-4 hover:border-[#9dbcaa] transition-colors"><div className="w-12 h-12 rounded-xl bg-[#e5efe4] text-[#377453] grid place-items-center"><ClipboardList size={24}/></div><div className="flex-1 min-w-0"><div className="font-bold text-lg truncate">{company.name}</div><div className="text-xs text-[#78857a]">Gerenciar formulários e respostas</div></div><ArrowUpRight className="text-[#6c9a7b]" size={20}/></Link>)}</div>}
      </section>
      <CreateBusiness/>
    </div>
    <div className="text-center mt-14 text-sm text-[#8b958b] flex justify-center gap-2 items-center"><Plus size={15}/> Também funciona para lojas, serviços, salões, eventos e outras atividades.</div>
  </main></>;
}
