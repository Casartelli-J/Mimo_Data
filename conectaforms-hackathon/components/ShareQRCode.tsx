'use client';

import { useEffect, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { ClipboardCopy, Download, ExternalLink, QrCode, TriangleAlert } from 'lucide-react';

type ShareQRCodeProps = {
  /** Caminho público, por exemplo /f/meu-formulario-abc123. */
  path: string;
  title: string;
  demo?: boolean;
};

/**
 * QR gerado no navegador, sem enviar os links para serviços externos.
 * O endereço é baseado no host acessado: em produção aponta para o domínio real.
 */
export function ShareQRCode({ path, title, demo = false }: ShareQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [url, setUrl] = useState('');
  const [isLocal, setIsLocal] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const absolute = new URL(path, window.location.origin).toString();
    setUrl(absolute);
    setIsLocal(['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname));
  }, [path]);

  async function copyLink() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setError(false);
      setMessage('Link copiado!');
    } catch {
      setError(true);
      setMessage('Não foi possível copiar automaticamente. Selecione o endereço no campo abaixo e copie manualmente.');
    }
  }

  function downloadPNG() {
    const canvas = canvasRef.current;
    if (!canvas || !url) return;
    try {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `qr-${title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'formulario'}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setError(false);
      setMessage('QR Code salvo em PNG.');
    } catch {
      setError(true);
      setMessage('Não foi possível baixar a imagem neste navegador.');
    }
  }

  return <section id="compartilhar-formulario" className="panel p-5 sm:p-7 scroll-mt-6" aria-labelledby="compartilhar-titulo">
    <div className="flex items-start gap-3 mb-5">
      <div className="rounded-xl bg-[#e7f3e9] p-3 text-[#296848]"><QrCode size={22}/></div>
      <div>
        <h2 id="compartilhar-titulo" className="font-bold text-xl">Compartilhar por QR Code</h2>
        <p className="helper mt-1">Mostre o código no balcão, imprima ou envie a imagem aos clientes. Cada formulário tem seu próprio QR Code.</p>
      </div>
    </div>
    <div className="grid md:grid-cols-[280px_minmax(0,1fr)] gap-6 items-center">
      <div className="flex justify-center">
        <div className="bg-white p-3 border border-[#dfe9dc] rounded-2xl shadow-sm" aria-label={`QR Code para ${title}`}>
          {url ? <QRCodeCanvas
            ref={canvasRef}
            value={url}
            title={`Acessar formulário: ${title}`}
            size={240}
            marginSize={4}
            level="H"
            bgColor="#ffffff"
            fgColor="#17392c"
          /> : <div className="w-[240px] h-[240px] flex items-center justify-center text-sm text-[#6b7b70]">Preparando QR Code…</div>}
        </div>
      </div>
      <div className="min-w-0 space-y-4">
        <div>
          <label htmlFor={`qr-link-${demo?'demo':'form'}`} className="field-label">Link público</label>
          <input
            id={`qr-link-${demo?'demo':'form'}`}
            className="form-control text-sm"
            type="text"
            value={url}
            readOnly
            aria-label="Endereço público do formulário"
            onFocus={event => event.currentTarget.select()}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="button-primary !text-sm" onClick={downloadPNG} disabled={!url}>
            <Download size={17}/> Baixar PNG
          </button>
          <button type="button" className="button-secondary !text-sm" onClick={copyLink} disabled={!url}>
            <ClipboardCopy size={17}/> Copiar link
          </button>
          {url && <a href={url} target="_blank" rel="noopener noreferrer" className="button-secondary !text-sm">
            <ExternalLink size={17}/> Abrir
          </a>}
        </div>
        {message && <p role="status" className={error?'alert-error':'alert-success'}>{message}</p>}
        {isLocal && <div className="flex gap-2 items-start rounded-xl p-3 border border-[#f4e1b5] bg-[#fff9eb] text-sm text-[#77571f]">
          <TriangleAlert size={18} className="shrink-0 mt-0.5"/>
          <p><strong>Modo local:</strong> este QR Code aponta para <code>localhost</code> e não abrirá em outro celular. Para compartilhar, abra o painel pelo domínio publicado na Vercel e baixe o código lá.</p>
        </div>}
        {demo && <p className="helper">QR demonstrativo: direciona para <strong>/demo</strong>, sem salvar respostas no Supabase. Para compartilhar um formulário real, publique-o pelo painel.</p>}
      </div>
    </div>
  </section>;
}
