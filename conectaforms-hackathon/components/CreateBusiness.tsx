'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';

export function CreateBusiness() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true);setError('');
    try {
      const r = await fetch('/api/empresas',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name})});
      const data = await r.json(); if (!r.ok) throw new Error(data.error || 'Erro ao criar empresa.');
      router.push(`/dashboard/empresa/${data.business.id}`); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'Erro inesperado.'); }
    finally {setBusy(false);}
  }
  return <form className="panel p-6 sm:p-7" onSubmit={submit}>
    <h2 className="font-bold text-xl text-[#234834] flex items-center gap-2"><PlusCircle size={20}/> Adicionar negócio</h2>
    <p className="helper mt-2 mb-5">Cada negócio terá seus próprios formulários e respostas.</p>
    <label className="field-label" htmlFor="companyName">Nome do negócio</label>
    <div className="flex gap-2 mobile-stack"><input id="companyName" className="form-control" minLength={2} maxLength={120} required placeholder="Ex.: Senhora Cookies" value={name} onChange={e=>setName(e.target.value)}/><button className="button-primary whitespace-nowrap" disabled={busy}>{busy?'Criando...':'Criar negócio'}</button></div>
    {error && <p className="alert-error mt-3" role="alert">{error}</p>}
  </form>;
}
