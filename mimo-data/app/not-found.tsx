import Link from 'next/link';
export default function NotFound() {
  return <main className="min-h-screen flex flex-col justify-center items-center text-center p-6"><div className="kicker">404</div><h1 className="display text-5xl mt-3">Página não encontrada</h1><p className="text-[#778578] mt-4 max-w-md">O endereço pode estar incorreto ou o formulário ainda não foi publicado.</p><Link href="/" className="button-primary mt-6">Voltar ao início</Link></main>;
}
