'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircleMore, PlusCircle } from 'lucide-react';

export function CreateBusiness() {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const r = await fetch('/api/empresas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, whatsapp }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Erro ao criar empresa.');
      router.push(`/dashboard/empresa/${data.business.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro inesperado.');
    } finally {
      setBusy(false);
    }
  }

  return <form className="panel p-6 sm:p-7" onSubmit={submit}>
    <h2 className="font-bold text-xl text-[#234834] flex items-center gap-2"><PlusCircle size={20}/> Adicionar negócio</h2>
    <p className="helper mt-2 mb-5">Cada negócio terá seus próprios formulários, respostas e um botão de contato no WhatsApp.</p>

    <label className="field-label" htmlFor="companyName">Nome do negócio</label>
    <input
      id="companyName"
      className="form-control mb-4"
      minLength={2}
      maxLength={120}
      required
      placeholder="Ex.: Senhora Cookies"
      value={name}
      onChange={e => setName(e.target.value)}
    />

    <label className="field-label flex items-center gap-2" htmlFor="companyWhatsapp"><MessageCircleMore size={15}/> WhatsApp da empresa</label>
    <input
      id="companyWhatsapp"
      className="form-control"
      minLength={10}
      maxLength={25}
      required
      placeholder="Ex.: (51) 99999-9999"
      value={whatsapp}
      onChange={e => setWhatsapp(e.target.value)}
    />
    <p className="helper mt-2">Esse número será usado no botão final de contato via <code>wa.me</code>.</p>

    <div className="flex gap-2 mobile-stack mt-5">
      <button className="button-primary whitespace-nowrap" disabled={busy}>{busy ? 'Criando...' : 'Criar negócio'}</button>
    </div>
    {error && <p className="alert-error mt-3" role="alert">{error}</p>}
  </form>;
}
