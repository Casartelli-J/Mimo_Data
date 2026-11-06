'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Trash2 } from 'lucide-react';
import type { FormField, Submission } from '@/lib/types';

function escapeCsv(value:string):string {
  const safe = /^[=+@\-\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g,'""')}"`;
}

export function ResponsesTable({fields,rows}: {fields:FormField[];rows:Submission[]}) {
  const [deleting,setDeleting] = useState<string|null>(null);
  const [error,setError] = useState('');
  const router = useRouter();

  function downloadCsv() {
    const header = ['Data','Autorizou marketing',...fields.map(x=>x.label)];
    const matrix = [header,...rows.map(x=>[
      new Date(x.created_at).toLocaleString('pt-BR'),x.marketing_opt_in?'Sim':'Não',
      ...fields.map(f=>x.answers[f.key] || ''),
    ])];
    const csv = '\ufeff'+matrix.map(row=>row.map(escapeCsv).join(';')).join('\r\n');
    const href = URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
    const a = document.createElement('a');a.href=href;a.download='respostas.csv';a.click();URL.revokeObjectURL(href);
  }
  async function remove(id:string) {
    if(!confirm('Excluir permanentemente esta resposta?')) return;
    setDeleting(id);setError('');
    try {const r=await fetch(`/api/respostas/${id}`,{method:'DELETE'});if(!r.ok) throw new Error('Não foi possível excluir.');router.refresh();}
    catch(e){setError(e instanceof Error?e.message:'Erro.');}finally{setDeleting(null);}
  }
  return <section className="panel overflow-hidden">
    <div className="p-5 sm:p-6 flex justify-between items-center gap-4 flex-wrap border-b border-[#e7ede5]"><div><h2 className="font-bold text-xl">Respostas recebidas</h2><p className="helper mt-1">{rows.length} resposta(s) mais recente(s) · máximo de 200 exibidas</p></div><button className="button-secondary !text-sm" type="button" disabled={rows.length===0} onClick={downloadCsv}><Download size={16}/> Exportar CSV</button></div>
    {error && <div role="alert" className="alert-error m-5">{error}</div>}
    {rows.length===0 ? <div className="text-center p-12 text-[#7a887d]">Ainda não há respostas. Publique e compartilhe seu formulário para começar.</div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm min-w-[700px]"><thead className="bg-[#f6f9f4] text-[#5d715f]"><tr><th className="px-4 py-3 font-bold whitespace-nowrap">Recebido em</th>{fields.map(f=><th className="px-4 py-3 font-bold" key={f.key}>{f.label}</th>)}<th className="px-4 py-3 font-bold">Marketing</th><th className="px-4 py-3"/></tr></thead><tbody>{rows.map(row=><tr className="border-t border-[#e8eee7]" key={row.id}><td className="px-4 py-4 whitespace-nowrap text-[#728074]">{new Date(row.created_at).toLocaleString('pt-BR')}</td>{fields.map(f=><td className="px-4 py-4 max-w-55 break-words" key={f.key}>{row.answers[f.key]||'—'}</td>)}<td className="px-4 py-4">{row.marketing_opt_in?'Sim':'Não'}</td><td className="px-4 py-4"><button aria-label="Excluir resposta" className="button-ghost !text-[#ae594e]" type="button" disabled={deleting===row.id} onClick={()=>remove(row.id)}><Trash2 size={17}/></button></td></tr>)}</tbody></table></div>}
  </section>;
}
