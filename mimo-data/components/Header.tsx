import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function Header({ dashboard = false }: { dashboard?: boolean }) {
  return <header className="border-b border-[#e7e9df] bg-[#faf7f0]/95">
    <nav className="site-nav">
      <Link href="/" className="flex gap-3 items-center no-underline text-[#244632]">
        <Image src="/mimo-data-logo.png" alt="Mimo Data" width={196} height={68} className="w-[150px] sm:w-[175px] h-auto" priority />
      </Link>
      <div className="flex gap-2 items-center">
        <Link href="/demo" className="hidden sm:inline-flex button-ghost">Ver demonstração</Link>
        {dashboard ? <Link className="button-secondary text-sm !py-2.5" href="/dashboard">Meu painel</Link> : <Link className="button-primary text-sm !py-2.5" href="/login">Entrar <ArrowUpRight size={15}/></Link>}
      </div>
    </nav>
  </header>;
}
