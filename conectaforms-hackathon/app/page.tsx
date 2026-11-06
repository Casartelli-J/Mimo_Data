import Link from 'next/link';
import { ArrowRight, BadgeCheck, ChartNoAxesCombined, ClipboardList, HeartHandshake, LockKeyhole, Sparkles, Store } from 'lucide-react';
import { Header } from '@/components/Header';

export default function Home() {
  return <>
    <Header/>
    <main>
      <section className="site-shell grid lg:grid-cols-[1.05fr_.95fr] gap-10 lg:gap-16 items-center pt-18 pb-20 lg:pt-25 lg:pb-28">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#e7f1e8] text-[#286248] px-4 py-2 rounded-full text-xs font-bold mb-7"><Sparkles size={15}/> UMA VITRINE DIGITAL PARA CADA NEGÓCIO</div>
          <h1 className="display text-5xl sm:text-6xl xl:text-[76px] leading-[1.06] text-[#1c4030] max-w-[730px]">Conheça melhor seus clientes. <span className="text-[#ca8353]">Cresça do seu jeito.</span></h1>
          <p className="text-[#6b766b] text-lg leading-relaxed mt-7 max-w-[580px]">Crie formulários com a cara do seu negócio, reúna respostas em um só lugar e transforme cada contato em uma oportunidade de relacionamento.</p>
          <div className="flex flex-wrap gap-3 mt-9">
            <Link href="/demo" className="button-primary !px-6 !py-4">Experimentar demonstração <ArrowRight size={18}/></Link>
            <Link href="/login" className="button-secondary !px-6 !py-4">Criar minha conta</Link>
          </div>
          <div className="flex flex-wrap gap-5 mt-9 text-sm text-[#5b7163]">
            <span className="flex items-center gap-1.5"><BadgeCheck size={17}/> Para diferentes negócios</span>
            <span className="flex items-center gap-1.5"><BadgeCheck size={17}/> Fácil de configurar</span>
          </div>
        </div>
        <div className="relative min-h-[430px] lg:min-h-[550px] bg-[#e9e9dc] rounded-[34px] p-6 sm:p-10 overflow-hidden dot-grid">
          <div className="absolute w-64 h-64 rounded-full bg-[#dbb994]/65 -right-20 -top-14 blur-3xl"/>
          <div className="absolute w-52 h-52 rounded-full bg-[#a3cbb0]/80 -left-12 -bottom-12 blur-3xl"/>
          <div className="relative max-w-[420px] mx-auto shadow-[0_28px_70px_#334d362c] overflow-hidden rounded-[25px] bg-white rotate-[-3deg] border border-[#e5e8dd]">
            <div className="bg-[#613b2a] p-6 text-white flex items-center gap-4">
              <div className="rounded-[20px] h-13 w-13 bg-[#e8b576] flex items-center justify-center text-3xl">🍪</div>
              <div><div className="font-bold text-lg">Senhora Cookies</div><div className="text-sm text-[#efd5c2]">Seu sabor favorito começa aqui</div></div>
            </div>
            <div className="p-7 space-y-4">
              <div><div className="text-[11px] font-bold tracking-[.2em] text-[#bb7750]">QUEREMOS TE CONHECER</div><h3 className="display text-3xl text-[#583726] mt-2">Qual cookie combina com você?</h3></div>
              <div className="grid grid-cols-2 gap-3"><div><div className="text-xs font-semibold mb-1 text-[#644c3f]">Nome</div><div className="h-11 border rounded-lg border-[#eadbc9] bg-[#fffaf2] p-3 text-sm text-[#8d8075]">Ana</div></div><div><div className="text-xs font-semibold mb-1 text-[#644c3f]">Sobrenome</div><div className="h-11 border rounded-lg border-[#eadbc9] bg-[#fffaf2] p-3 text-sm text-[#8d8075]">Silva</div></div></div>
              <div><div className="text-xs font-semibold mb-1 text-[#644c3f]">Sabor favorito</div><div className="h-11 border rounded-lg border-[#eadbc9] bg-[#fffaf2] p-3 text-sm text-[#644c3f]">Chocolate ▾</div></div>
              <div className="bg-[#613b2a] text-white text-sm text-center font-bold py-3.5 rounded-xl">Enviar preferência</div>
            </div>
          </div>
          <div className="absolute right-3 bottom-9 sm:right-4 lg:right-0 bg-white shadow-xl rounded-2xl p-4 border border-[#e0e5d8] rotate-[5deg]">
            <div className="flex gap-2 items-center"><ChartNoAxesCombined size={20} color="#2c7850"/><span className="font-bold text-sm">Tudo organizado</span></div>
            <p className="text-xs text-[#718276] mt-1">Respostas no seu painel</p>
          </div>
        </div>
      </section>
      <section className="bg-white border-y border-[#e6ebe2] py-18">
        <div className="site-shell">
          <div className="kicker mb-3">PENSADO PARA EMPREENDEDORES</div>
          <h2 className="display text-4xl sm:text-5xl max-w-2xl">Seu negócio é único. O formulário também pode ser.</h2>
          <div className="grid md:grid-cols-3 gap-5 mt-10">
            {[
              {icon:<ClipboardList size={25}/>,t:'Formulários sob medida',p:'Monte campos de texto, telefone e opções de escolha, sem precisar programar.'},
              {icon:<Store size={25}/>,t:'Vários tipos de negócio',p:'Da confeitaria ao salão de beleza. Você personaliza o que quer perguntar.'},
              {icon:<LockKeyhole size={25}/>,t:'Informações protegidas',p:'Empresas têm seus próprios dados e respostas só aparecem no painel autorizado.'},
            ].map(x=><div className="p-7 rounded-2xl border border-[#e2e7de] bg-[#fbfdf9]" key={x.t}><div className="text-[#2c6a4c] bg-[#e9f3e9] w-12 h-12 rounded-xl grid place-items-center mb-5">{x.icon}</div><h3 className="font-bold text-lg">{x.t}</h3><p className="text-[#738075] leading-relaxed mt-2">{x.p}</p></div>)}
          </div>
        </div>
      </section>
      <section className="site-shell py-18 flex flex-col sm:flex-row items-center gap-7 justify-between"><div className="max-w-xl"><div className="kicker">PROTÓTIPO DO HACKATHON</div><h2 className="display text-4xl mt-3">A Senhora Cookies foi só o começo.</h2><p className="text-[#6b766b] mt-3 leading-relaxed">O mesmo sistema atende diferentes mercados com formulários personalizados.</p></div><Link href="/demo" className="button-primary">Ver exemplo funcionando <HeartHandshake size={18}/></Link></section>
    </main>
    <footer className="border-t border-[#e1e7de] py-8 text-sm text-[#7a8378] text-center">ConectaForms · Protótipo acadêmico para o Hackathon UniSenac · 2026</footer>
  </>;
}
