'use client';

import Image from 'next/image';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function Login() {
  const [mode, setMode] = useState<'login'|'cadastro'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const router = useRouter();
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      const auth = supabaseBrowser().auth;
      if (mode === 'cadastro') {
        const { data, error } = await auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/auth/callback` } });
        if (error) throw error;
        if (data.session) { router.push('/dashboard'); router.refresh(); }
        else setNotice('Conta solicitada! Verifique seu e-mail para confirmar o cadastro, caso a confirmação esteja ativada no Supabase.');
      } else {
        const { error } = await auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard'); router.refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível entrar.');
    } finally { setBusy(false); }
  }

  return <div className="min-h-screen grid lg:grid-cols-2">
    <div className="bg-[#e7eddf] hidden lg:flex p-16 flex-col justify-between relative overflow-hidden">
      <Link href="/" className="inline-flex"><Image src="/mimo-data-logo.png" alt="Mimo Data" width={240} height={82} className="w-[220px] h-auto" priority /></Link>
      <div className="relative z-10"><div className="text-[#2b7c54] font-bold text-xs tracking-[.19em] mb-4">MAIS CONEXÃO, MENOS COMPLICAÇÃO</div><h1 className="display text-6xl leading-tight text-[#234c36] max-w-lg">Cada cliente tem uma história. Comece ouvindo.</h1><p className="text-lg text-[#587361] max-w-md mt-5">Centralize os dados importantes e fortaleça o relacionamento com quem escolhe seu negócio.</p></div>
      <div className="text-[#64806d] text-sm">Hackathon de Empreendedorismo · UniSenac</div>
      <div className="absolute w-90 h-90 rounded-full border-[65px] border-[#d1dec9] -right-25 -top-10"/>
    </div>
    <div className="flex flex-col bg-[#faf7f0] px-5 py-8 sm:px-12">
      <div className="flex justify-between items-center gap-4"><Link className="button-ghost !pl-0 flex gap-2 items-center" href="/"><ArrowLeft size={16}/> Voltar</Link><Image src="/mimo-data-logo.png" alt="Mimo Data" width={164} height={56} className="w-[138px] sm:w-[152px] h-auto" priority /></div>
      <div className="w-full max-w-[420px] mx-auto my-auto py-16">
        <div className="bg-[#e5f0e3] h-13 w-13 flex items-center justify-center rounded-2xl text-[#2c754d] mb-7"><LockKeyhole size={24}/></div>
        <h1 className="display text-5xl text-[#264530]">{mode === 'login' ? 'Que bom te ver!' : 'Comece por aqui.'}</h1>
        <p className="text-[#738077] mt-3 mb-8">{mode === 'login' ? 'Entre para acompanhar seus formulários e respostas.' : 'Crie sua conta e personalize seu primeiro formulário.'}</p>
        {!configured && <div className="alert-error mb-5">Configure o Supabase para ativar o login. Enquanto isso, veja o <Link className="underline" href="/demo">modo demonstração</Link>.</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label className="field-label" htmlFor="email">E-mail</label><input required autoComplete="email" id="email" type="email" className="form-control" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@empresa.com.br"/></div>
          <div><label className="field-label" htmlFor="password">Senha</label><input required minLength={8} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} id="password" type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo de 8 caracteres"/></div>
          {error && <p role="alert" className="alert-error">{error}</p>}
          {notice && <p role="status" className="alert-success">{notice}</p>}
          <button disabled={!configured || busy} className="button-primary w-full !py-3.5" type="submit">{busy ? 'Aguarde...' : mode === 'login' ? 'Entrar no painel' : 'Criar minha conta'}</button>
        </form>
        <p className="text-center text-sm text-[#718174] mt-7">{mode === 'login' ? 'Ainda não tem uma conta?' : 'Já possui conta?'} <button type="button" className="font-bold text-[#28664d] hover:underline" onClick={()=>{setMode(mode==='login'?'cadastro':'login');setError('');setNotice('');}}>{mode === 'login' ? 'Cadastre-se' : 'Entrar'}</button></p>
      </div>
    </div>
  </div>;
}
