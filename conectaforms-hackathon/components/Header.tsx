import Link from 'next/link';
import { ArrowUpRight, Layers3 } from 'lucide-react';

export function Header({ dashboard = false }: { dashboard?: boolean }) {
  return <header className="border-b border-[#e7e9df] bg-[#faf7f0]/95">
    <nav className="site-nav">
      <Link href="/" className="flex gap-2.5 items-center no-underline text-[#244632]">
        <span className="w-9 h-9 rounded-xl bg-[#276048] flex items-center justify-center text-white"><Layers3 size={19}/></span>
        <span className="brand text-2xl">Mimo<span className="text-[#cf8352]"> Data</span></span>
      </Link>
      <div className="flex gap-2 items-center">
        <Link href="/demo" className="hidden sm:inline-flex button-ghost">Ver demonstração</Link>
        {dashboard ? <Link className="button-secondary text-sm !py-2.5" href="/dashboard">Meu painel</Link> : <Link className="button-primary text-sm !py-2.5" href="/login">Entrar <ArrowUpRight size={15}/></Link>}
      </div>
    </nav>
  </header>;
}
