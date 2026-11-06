'use client';

import Image from 'next/image';
import { useMemo, useState, type CSSProperties, type FormEvent } from 'react';
import { ArrowRight, CircleCheck, LockKeyhole, MessageCircleMore, Send } from 'lucide-react';
import type { FormRecord } from '@/lib/types';
import { themePalette } from '@/lib/types';
import { buildWhatsAppLink } from '@/lib/whatsapp';

type PublicFields = Pick<FormRecord,'id'|'title'|'brand_name'|'description'|'theme'|'fields'>;

export function PublicForm({
  form,
  businessWhatsapp,
  onDemoSubmit,
}: {
  form: PublicFields;
  businessWhatsapp?: string | null;
  onDemoSubmit?: (answers: Record<string, string>, optIn: boolean) => void;
}) {
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [accepted,setAccepted] = useState(false);
  const [marketing,setMarketing] = useState(false);
  const [website,setWebsite] = useState('');
  const [busy,setBusy] = useState(false);
  const [sent,setSent] = useState(false);
  const [error,setError] = useState('');
  const theme = themePalette[form.theme] || themePalette.verde;
  const style = {'--form-primary':theme.primary,'--form-background':theme.background,'--form-light':theme.light} as CSSProperties;
  const waMessage = useMemo(() => {
    const firstName = answers.nome?.trim();
    return `Olá! Acabei de responder o formulário \"${form.title}\"${firstName ? ` e sou ${firstName}` : ''}. Gostaria de continuar o atendimento pelo WhatsApp.`;
  }, [answers.nome, form.title]);
  const waLink = useMemo(() => buildWhatsAppLink(businessWhatsapp, waMessage), [businessWhatsapp, waMessage]);

  function openWhatsApp() {
    if (!waLink) return;
    window.open(waLink, '_blank', 'noopener,noreferrer');
  }

  async function submit(event:FormEvent) {
    event.preventDefault();setBusy(true);setError('');
    try {
      if(!accepted) throw new Error('É necessário concordar com o uso de seus dados para responder.');
      if(onDemoSubmit){
        onDemoSubmit(answers,marketing);
        setSent(true);
        if (waLink) setTimeout(openWhatsApp, 150);
        return;
      }
      const response = await fetch('/api/respostas',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({form_id:form.id,answers,privacy_accepted:accepted,marketing_opt_in:marketing,website})});
      const data = await response.json();if(!response.ok) throw new Error(data.error||'Não foi possível enviar.');
      setSent(true);setAnswers({});
      if (waLink) setTimeout(openWhatsApp, 150);
    }catch(e){setError(e instanceof Error?e.message:'Erro no envio.');}
    finally{setBusy(false);}
  }

  return <div style={style} className="min-h-[580px] rounded-[24px] overflow-hidden shadow-[0_20px_55px_#24362a16] border border-[#e8e7da] grid lg:grid-cols-[.82fr_1.18fr] bg-white">
    <aside className="bg-[var(--form-primary)] text-white p-8 lg:p-10 flex flex-col gap-10 justify-between relative overflow-hidden min-h-[190px] lg:min-h-0">
      <div className="relative z-10">
        <div className="flex gap-3 items-center">
          <div className="w-14 h-14 grid place-items-center rounded-2xl bg-white/14 text-white p-2">
            <Image src="/mimo-data-icon.png" alt="Mimo Data" width={34} height={46} className="w-auto h-10" priority />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[.18em] text-white/65 font-bold">Mimo Data</div>
            <div className="text-2xl font-bold tracking-tight">{form.brand_name}</div>
          </div>
        </div>
        <div className="w-15 h-1 rounded-full bg-white/50 mt-7"/>
      </div>
      <div className="relative z-10 hidden lg:block">
        <div className="text-[95px] leading-none opacity-80 mb-5">✦</div>
        <h2 className="display text-4xl leading-tight">Feito especialmente para você.</h2>
        <p className="text-white/75 mt-3 leading-relaxed">Responda ao formulário e finalize o atendimento falando direto com a empresa pelo WhatsApp.</p>
      </div>
      <div className="absolute w-50 h-50 rounded-full border-[25px] border-white/8 -right-10 top-26"/>
      <div className="text-xs text-white/60 flex items-center gap-2 relative z-10"><LockKeyhole size={13}/> Seus dados são tratados com cuidado.</div>
    </aside>
    <section className="p-7 sm:p-10 lg:p-12 bg-[var(--form-background)]">
      {sent ? <div className="h-full min-h-[370px] flex flex-col justify-center items-center text-center">
        <div className="bg-[var(--form-light)] text-[var(--form-primary)] h-18 w-18 rounded-full grid place-items-center mb-6"><CircleCheck size={39}/></div>
        <h2 className="display text-4xl text-[var(--form-primary)]">Tudo certo!</h2>
        <p className="text-[#6e776e] mt-3 max-w-md leading-relaxed">Sua resposta foi registrada{onDemoSubmit?' no modo demonstração':''}. Obrigado por participar! {waLink ? 'Agora você já pode continuar pelo WhatsApp da empresa.' : ''}</p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {waLink && <button type="button" className="button-primary !py-3 !px-5" onClick={openWhatsApp}><MessageCircleMore size={17}/> Falar no WhatsApp</button>}
          <button type="button" className="button-secondary" onClick={()=>{setSent(false);setAccepted(false);setMarketing(false);setAnswers({});}}>Enviar outra resposta</button>
        </div>
      </div> : <>
        <div className="uppercase tracking-[.19em] text-xs font-bold text-[var(--form-primary)] opacity-75">Queremos saber de você</div>
        <h1 className="display text-4xl sm:text-[43px] leading-tight text-[var(--form-primary)] mt-3">{form.title}</h1>
        <p className="text-[#7a8177] text-sm leading-relaxed mt-3 mb-7">{form.description}</p>
        <form className="space-y-4" onSubmit={submit}>
          {form.fields.map(field=><div key={field.key}><label htmlFor={`field-${field.key}`} className="field-label !text-[var(--form-primary)]">{field.label}{field.required&&<span className="text-red-600"> *</span>}</label>
            {field.type==='select'?<select required={field.required} id={`field-${field.key}`} className="form-control !border-[#ddddd0]" value={answers[field.key]||''} onChange={e=>setAnswers(a=>({...a,[field.key]:e.target.value}))}><option value="">Selecione uma opção</option>{(field.options||[]).map(option=><option value={option} key={option}>{option}</option>)}</select>
            :<input id={`field-${field.key}`} className="form-control !border-[#ddddd0]" type={field.type} maxLength={240} required={field.required} value={answers[field.key]||''} onChange={e=>setAnswers(a=>({...a,[field.key]:e.target.value}))} placeholder={field.placeholder||'Sua resposta'}/>}
          </div>)}
          <div className="absolute -left-[9999px] opacity-0" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)}/></div>
          <div className="space-y-3 pt-2"><label className="flex items-start gap-3 text-xs leading-relaxed text-[#69786b]"><input required type="checkbox" className="accent-[var(--form-primary)] mt-0.5" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/><span>Concordo com o uso dos dados preenchidos para registro e atendimento desta solicitação. <strong>Obrigatório.</strong></span></label><label className="flex items-start gap-3 text-xs leading-relaxed text-[#69786b]"><input type="checkbox" className="accent-[var(--form-primary)] mt-0.5" checked={marketing} onChange={e=>setMarketing(e.target.checked)}/><span>Também aceito receber novidades e ofertas deste negócio pelo contato informado. <strong>Opcional.</strong></span></label></div>
          {error&&<p role="alert" className="alert-error">{error}</p>}
          <button type="submit" disabled={busy||!accepted} className="w-full min-h-13 rounded-xl text-white font-bold flex justify-center gap-2 items-center cursor-pointer bg-[var(--form-primary)] hover:brightness-110 transition-all">{busy?'Enviando...':waLink?'Finalizar e abrir WhatsApp':'Enviar resposta'}{busy?<Send size={15}/>:<ArrowRight size={18}/>}</button>
          <p className="text-center text-[11px] text-[#9ca39b]">Nenhuma cobrança. Suas informações não ficam visíveis ao público.</p>
        </form>
      </>}
    </section>
  </div>;
}
