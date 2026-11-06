'use client';

import { FormEvent, useState } from 'react';
import { Building2, MessageCircleMore, Save } from 'lucide-react';

export function BusinessSettings({ id, initialName, initialWhatsapp }: { id: string; initialName: string; initialWhatsapp?: string | null }) {
  const [name, setName] = useState(initialName);
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/api/empresas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, whatsapp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível salvar as alterações.');
      setSuccess('Dados da empresa atualizados com sucesso.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro inesperado.');
    } finally {
      setBusy(false);
    }
  }

  return <form className="panel p-6 sm:p-7" onSubmit={submit}>
    <h2 className="font-bold text-xl text-[#234834] flex items-center gap-2"><Building2 size={20}/> Dados da empresa</h2>
    <p className="helper mt-2 mb-5">O número abaixo será usado no botão final de contato via WhatsApp dos formulários publicados.</p>

    <label className="field-label" htmlFor="businessName">Nome do negócio</label>
    <input id="businessName" className="form-control mb-4" required minLength={2} maxLength={120} value={name} onChange={e => setName(e.target.value)} />

    <label className="field-label flex items-center gap-2" htmlFor="businessWhatsapp"><MessageCircleMore size={15}/> WhatsApp da empresa</label>
    <input id="businessWhatsapp" className="form-control" required minLength={10} maxLength={25} value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="Ex.: (51) 99999-9999" />

    <div className="mt-5 flex items-center gap-3 flex-wrap">
      <button className="button-primary" disabled={busy} type="submit"><Save size={16}/> {busy ? 'Salvando...' : 'Salvar dados da empresa'}</button>
      {success && <span className="text-sm text-[#2c734d] font-semibold">{success}</span>}
    </div>
    {error && <p className="alert-error mt-3" role="alert">{error}</p>}
  </form>;
}
