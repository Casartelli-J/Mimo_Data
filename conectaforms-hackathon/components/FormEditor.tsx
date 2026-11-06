'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardCopy, ExternalLink, Plus, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { FormField, FormRecord, FieldType, Theme } from '@/lib/types';
import { cookieFields } from '@/lib/types';

const genericFields: FormField[] = [
  {key:'nome',label:'Nome',type:'text',required:true,placeholder:'Seu nome'},
  {key:'sobrenome',label:'Sobrenome',type:'text',required:true,placeholder:'Seu sobrenome'},
  {key:'telefone',label:'WhatsApp / telefone',type:'tel',required:true,placeholder:'(51) 99999-9999'},
  {key:'interesse',label:'Produto ou serviço de interesse',type:'select',required:true,options:['Opção A','Opção B','Opção C']},
];

export function FormEditor({businessId, businessName, initial}: {businessId:string; businessName:string; initial?:FormRecord}) {
  const cookie = businessName.toLowerCase().includes('cookie');
  const [title,setTitle] = useState(initial?.title || (cookie?'Seu sabor favorito':'Vamos nos conhecer?'));
  const [brandName,setBrandName] = useState(initial?.brand_name || businessName);
  const [description,setDescription] = useState(initial?.description || (cookie?'Conte seu sabor preferido e fique mais perto da gente.':'Conte um pouco sobre você e suas preferências.'));
  const [theme,setTheme] = useState<Theme>(initial?.theme || (cookie?'caramelo':'verde'));
  const [published,setPublished] = useState(initial?.published || false);
  const [fields,setFields] = useState<FormField[]>(initial?.fields || (cookie?cookieFields:genericFields));
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const [success,setSuccess] = useState('');
  const router = useRouter();

  function update(index:number, patch:Partial<FormField>) {
    setFields(previous=>previous.map((field,i)=>i===index?{...field,...patch}:field));
  }
  function addField() {
    if (fields.length>=12) return;
    setFields(prev=>[...prev,{key:`campo_${crypto.randomUUID().slice(0,8)}`,label:'Novo campo',type:'text',required:false,placeholder:''}]);
  }
  function updateType(index:number, type:FieldType) {
    update(index,{type,options:type==='select'?(fields[index].options?.length?fields[index].options:['Opção 1','Opção 2']):undefined});
  }

  async function submit(event:FormEvent) {
    event.preventDefault();setBusy(true);setError('');setSuccess('');
    try {
      const url = initial?`/api/formularios/${initial.id}`:'/api/formularios';
      const method = initial?'PATCH':'POST';
      const r = await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify({
        ...(!initial?{business_id:businessId}:{}),
        title,brand_name:brandName,description,theme,fields,
        ...(initial?{published}:{}),
      })});
      const data = await r.json();
      if(!r.ok) throw new Error([data.error, ...(data.details || [])].filter(Boolean).join(' '));
      if(initial){setSuccess('Formulário atualizado com sucesso.');router.refresh();}
      else {router.push(`/dashboard/formularios/${data.form.id}`);router.refresh();}
    }catch(e){setError(e instanceof Error?e.message:'Não foi possível salvar.');}
    finally{setBusy(false);}
  }

  async function copyUrl(){if(initial) {try{await navigator.clipboard.writeText(`${location.origin}/f/${initial.slug}`);setSuccess('Link copiado!');}catch{setError('Não foi possível copiar; abra o formulário e copie o endereço.');}}}

  return <form className="panel p-5 sm:p-7 space-y-6" onSubmit={submit}>
    <div className="grid sm:grid-cols-2 gap-4"><div className="sm:col-span-2"><label className="field-label" htmlFor="title">Título do formulário</label><input required id="title" maxLength={120} minLength={3} value={title} onChange={e=>setTitle(e.target.value)} className="form-control"/></div><div className="sm:col-span-2"><label className="field-label" htmlFor="brand">Marca que aparece para o cliente</label><input required id="brand" maxLength={120} value={brandName} onChange={e=>setBrandName(e.target.value)} className="form-control"/></div><div className="sm:col-span-2"><label className="field-label" htmlFor="description">Texto de apresentação</label><textarea required id="description" rows={2} maxLength={500} value={description} onChange={e=>setDescription(e.target.value)} className="form-control"/></div><div className="sm:col-span-2"><label className="field-label" htmlFor="theme">Cor do formulário</label><select id="theme" className="form-control" value={theme} onChange={e=>setTheme(e.target.value as Theme)}><option value="caramelo">Caramelo</option><option value="verde">Verde</option><option value="azul">Azul</option><option value="rosa">Rosa</option></select></div></div>
    <div className="border-t border-[#e8eee6] pt-5"><div className="flex justify-between items-center mb-4 gap-2"><div><h3 className="font-bold text-lg">Perguntas do formulário</h3><p className="helper">Até 12 campos. As opções são separadas por vírgulas.</p></div><button onClick={addField} disabled={fields.length>=12} className="button-secondary !px-3 !py-2 text-sm" type="button"><Plus size={15}/> Campo</button></div>
      <div className="space-y-3">{fields.map((field,index)=><div key={field.key} className="bg-[#f9faf7] rounded-xl border border-[#e1e9df] p-4">
        <div className="flex justify-between items-center mb-3"><span className="text-xs font-bold text-[#7b8b7e]">CAMPO {index+1}</span><button type="button" aria-label={`Remover campo ${index+1}`} disabled={fields.length===1} className="button-ghost !text-red-700 !p-1" onClick={()=>setFields(old=>old.filter((_,i)=>i!==index))}><Trash2 size={16}/></button></div>
        <div className="grid sm:grid-cols-[1fr_140px] gap-3"><div><label className="field-label" htmlFor={`label${index}`}>Pergunta</label><input id={`label${index}`} value={field.label} maxLength={80} onChange={e=>update(index,{label:e.target.value})} required minLength={2} className="form-control !min-h-10 !py-2"/></div><div><label className="field-label" htmlFor={`type${index}`}>Tipo</label><select id={`type${index}`} value={field.type} className="form-control !min-h-10 !py-2" onChange={e=>updateType(index,e.target.value as FieldType)}><option value="text">Texto</option><option value="tel">Telefone</option><option value="select">Seleção</option></select></div></div>
        {field.type==='select' && <div className="mt-3"><label className="field-label" htmlFor={`options${index}`}>Opções (separe com vírgulas)</label><input id={`options${index}`} className="form-control !min-h-10 !py-2" value={(field.options || []).join(', ')} onChange={e=>update(index,{options:e.target.value.split(',').map(x=>x.trim()).filter(Boolean)})}/></div>}
        <label className="inline-flex gap-2 items-center mt-3 text-sm text-[#596d5f]"><input type="checkbox" className="accent-[#357452]" checked={field.required} onChange={e=>update(index,{required:e.target.checked})}/> Resposta obrigatória</label>
      </div>)}</div>
    </div>
    {initial && <div className="flex items-start gap-3 border-t border-[#e8eee6] pt-5"><input className="accent-[#357452] mt-1" id="publish" type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)}/><div><label className="font-bold text-sm cursor-pointer" htmlFor="publish">Publicar formulário</label><p className="helper">Quando ativado e salvo, qualquer pessoa com o link pode responder.</p></div></div>}
    {error && <p className="alert-error" role="alert">{error}</p>}{success && <p className="alert-success" role="status">{success}</p>}
    <button className="button-primary w-full" disabled={busy} type="submit"><Save size={17}/>{busy?'Salvando...':initial?'Salvar alterações':'Criar formulário'}</button>
    {initial?.published && <div className="flex flex-wrap gap-2"><button className="button-secondary !text-sm flex-1" type="button" onClick={copyUrl}><ClipboardCopy size={16}/> Copiar link</button><Link target="_blank" href={`/f/${initial.slug}`} className="button-secondary !text-sm flex-1"><ExternalLink size={16}/> Abrir</Link></div>}
    <p className="helper">Campos coletados somente para as finalidades informadas. O uso promocional exige autorização separada do cliente.</p>
  </form>;
}
