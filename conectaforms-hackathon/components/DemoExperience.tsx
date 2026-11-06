'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, ChartColumn, ClipboardList, MousePointerClick, RotateCcw, Users } from 'lucide-react';
import Link from 'next/link';
import { PublicForm } from '@/components/PublicForm';
import { cookieFields } from '@/lib/types';
import type { Submission } from '@/lib/types';

const exampleRows: Submission[] = [
  {id:'example-1',form_id:'demo',created_at:'2026-11-06T12:30:00-03:00',answers:{nome:'Mariana',sobrenome:'Lima',telefone:'(51) 99999-1001',sabor:'Chocolate'},privacy_accepted:true,marketing_opt_in:true},
  {id:'example-2',form_id:'demo',created_at:'2026-11-06T12:20:00-03:00',answers:{nome:'Lucas',sobrenome:'Souza',telefone:'(51) 99999-2002',sabor:'Red Velvet'},privacy_accepted:true,marketing_opt_in:false},
  {id:'example-3',form_id:'demo',created_at:'2026-11-06T12:10:00-03:00',answers:{nome:'Beatriz',sobrenome:'Costa',telefone:'(51) 99999-3003',sabor:'Chocolate'},privacy_accepted:true,marketing_opt_in:true},
];

const demoForm = {id:'demo',brand_name:'Senhora Cookies',title:'Qual é o seu cookie favorito?',description:'Conta pra gente qual sabor combina mais com você! Queremos tornar cada experiência especial.',theme:'caramelo' as const,fields:cookieFields};

export function DemoExperience() {
  const [tab,setTab] = useState<'formulario'|'painel'>('formulario');
  const [rows,setRows] = useState<Submission[]>(exampleRows);
  const [newAnswer,setNewAnswer] = useState(false);
  const totals = Object.entries(rows.reduce<Record<string,number>>((acc,row)=>{
    const flavor=row.answers.sabor || 'Não informado';acc[flavor]=(acc[flavor]||0)+1;return acc;
  },{})).sort((a,b)=>b[1]-a[1]);

  function addResponse(answers:Record<string,string>,optIn:boolean) {
    setRows(old=>[{id:crypto.randomUUID(),form_id:'demo',created_at:new Date().toISOString(),answers,privacy_accepted:true,marketing_opt_in:optIn},...old]);
    setNewAnswer(true);
  }

  return <div className="site-shell py-8 sm:py-12">
    <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#547b61] font-bold hover:underline mb-7"><ArrowLeft size={16}/> Voltar à página inicial</Link>
    <div className="flex flex-wrap gap-4 justify-between items-start mb-6"><div><div className="kicker">PROTÓTIPO INTERATIVO</div><h1 className="display text-4xl sm:text-5xl mt-2">Teste com a Senhora Cookies 🍪</h1><p className="text-[#6b7a6e] mt-3 max-w-2xl">Faça um cadastro de teste e veja a resposta aparecer no painel. O mesmo modelo pode ser personalizado para outros negócios.</p></div><Link href="/login" className="button-secondary !text-sm">Quero meu painel <ArrowRight size={16}/></Link></div>
    <div className="bg-[#eaf2e9] border border-[#d0e4d1] rounded-2xl text-sm text-[#386044] px-5 py-4 mb-6 flex gap-3 items-start"><MousePointerClick size={21} className="shrink-0"/><p><strong>Modo demonstração:</strong> os contatos exibidos inicialmente são fictícios. Novas respostas ficam somente na memória desta página e <strong>não são enviadas ao Supabase</strong>. Acesse o painel e preencha um formulário para testar o fluxo.</p></div>
    <div className="flex flex-wrap gap-2 mb-7"><button className={tab==='formulario'?'button-primary':'button-secondary'} type="button" onClick={()=>setTab('formulario')}><ClipboardList size={17}/> Formulário do cliente</button><button className={tab==='painel'?'button-primary':'button-secondary'} type="button" onClick={()=>{setTab('painel');setNewAnswer(false);}}><ChartColumn size={17}/> Painel da empresa {newAnswer&&<span className="text-xs rounded-full bg-[#dbf4a4] text-[#2f5e20] px-1.5">+1</span>}</button></div>
    {tab==='formulario'?<div className="max-w-[980px] mx-auto"><PublicForm form={demoForm} onDemoSubmit={addResponse}/><div className="flex justify-center mt-6"><button className="button-secondary text-sm" type="button" onClick={()=>{setTab('painel');setNewAnswer(false);}}>Ver respostas no painel <ArrowRight size={16}/></button></div></div>
    :<div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4"><div className="panel p-6"><span className="helper">Respostas registradas</span><div className="text-4xl font-bold mt-2 text-[#285d45]">{rows.length}</div><div className="text-xs text-[#819083] mt-2 flex gap-1"><Users size={14}/> Nesta demonstração</div></div><div className="panel p-6"><span className="helper">Sabor mais escolhido</span><div className="text-2xl font-bold mt-3 text-[#70472c]">{totals[0]?.[0] || '—'}</div><div className="text-xs text-[#819083] mt-2">{totals[0]?.[1] || 0} preferência(s)</div></div><div className="panel p-6"><span className="helper">Aceitam receber novidades</span><div className="text-4xl font-bold mt-2 text-[#285d45]">{rows.filter(r=>r.marketing_opt_in).length}</div><div className="text-xs text-[#819083] mt-2">Autorização opcional</div></div></div>
      <div className="grid lg:grid-cols-[.68fr_1.32fr] gap-5 items-start"><div className="panel p-6"><h2 className="font-bold text-xl mb-5">Sabores preferidos</h2>{totals.map(([sabor,n])=><div className="mb-4" key={sabor}><div className="flex justify-between text-sm mb-2"><span>{sabor}</span><b>{n}</b></div><div className="h-2.5 bg-[#eaf0e9] rounded-full overflow-hidden"><div className="h-full bg-[#5b966a] rounded-full" style={{width:`${100*n/rows.length}%`}}/></div></div>)}<div className="mt-5 p-4 bg-[#f7f9f4] rounded-xl text-[#7e8a7d] text-xs">Análise ilustrativa de preferências coletadas.</div></div>
        <div className="panel overflow-hidden"><div className="flex gap-3 items-center flex-wrap justify-between p-5 sm:p-6 border-b border-[#e5ebe3]"><div><h2 className="font-bold text-xl">Clientes cadastrados</h2><p className="helper mt-1">Resultados ilustrativos + respostas desta sessão</p></div><button className="button-ghost !text-xs inline-flex items-center gap-1" onClick={()=>setRows(exampleRows)}><RotateCcw size={14}/> Reiniciar dados</button></div><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-sm"><thead className="bg-[#f6f9f4] text-[#607064]"><tr><th className="text-left p-4">Nome</th><th className="text-left p-4">Telefone</th><th className="text-left p-4">Sabor</th><th className="text-left p-4">Novidades</th></tr></thead><tbody>{rows.map(row=><tr className="border-t border-[#eaf0e9]" key={row.id}><td className="p-4 font-semibold">{row.answers.nome} {row.answers.sobrenome}</td><td className="p-4">{row.answers.telefone}</td><td className="p-4">{row.answers.sabor}</td><td className="p-4">{row.marketing_opt_in?'Sim':'Não'}</td></tr>)}</tbody></table></div></div>
      </div><button className="button-primary" onClick={()=>setTab('formulario')}><ClipboardList size={18}/> Cadastrar mais um cliente</button>
    </div>}
  </div>;
}
